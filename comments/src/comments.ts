import {
  FastifyInstance,
  FastifyPluginOptions,
  RouteShorthandOptions,
} from 'fastify';
import axios from 'axios';
import { eventBusApiOrigin } from './constants';

interface Comment {
  id: string;
  content: string;
  status: string;
}

interface CommentsForPost {
  postId: string;
  comments: Comment[];
}

interface GetComments {
  Querystring: {
    postId: string;
  };
  Reply: CommentsForPost[];
}

interface PostComment {
  Body: {
    id: string;
    postId: string;
    content: string;
    status: string;
  };
  Reply: {
    result: 'success';
  };
}

interface PostEvent {
  Body: {
    eventType: 'CommentModerated';
    eventData: {
      id: string;
      postId: string;
      content: string;
      status: 'approved' | 'rejected';
    };
  };
  Reply: {
    result: 'success';
  };
}

const allComments: CommentsForPost[] = [];

export async function commentRoutes(
  router: FastifyInstance,
  options: FastifyPluginOptions
) {
  const opts: { [keys: string]: RouteShorthandOptions } = {};

  // json schema for data validation
  opts['get-comments'] = {
    schema: {
      response: {
        200: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              postId: { type: 'string' },
              comments: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    id: { type: 'string' },
                    content: { type: 'string' },
                    status: { type: 'string' },
                  },
                },
              },
            },
          },
        },
      },
    },
  };

  router.get<GetComments>(
    '/comments',
    opts['get-comments'],
    async (req, res) => {
      console.log({ allComments });
      return allComments;
    }
  );

  opts['post-comments'] = {
    schema: {
      body: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          postId: { type: 'string' },
          content: { type: 'string' },
          status: { type: 'string' },
        },
      },
      response: {
        201: {
          type: 'object',
          properties: {
            result: { type: 'string', pattern: 'success' },
          },
        },
      },
    },
  };

  router.post<PostComment>(
    '/comment',
    opts['post-comments'],
    async (req, res) => {
      const { id, postId, content, status } = req.body;

      const commentsItem = allComments.find((item) => item.postId === postId);

      if (!commentsItem) {
        allComments.push({
          postId,
          comments: [{ id, content, status }],
        });
      } else {
        commentsItem.comments.push({ id, content, status });
      }

      try {
        await axios.post(`${eventBusApiOrigin}/event`, {
          eventType: 'CommentCreated',
          eventData: { postId, id, content, status },
        });
      } catch (e: any) {
        req.log.error(`Error occured for Post to event-bus: ${e.message}`);
      }

      res.code(201);
      return { result: 'success' };
    }
  );

  opts['post-event'] = {
    schema: {
      body: {
        type: 'object',
        properties: {
          eventType: { type: 'string' },
          eventData: {},
        },
      },
      response: {
        201: {
          type: 'object',
          properties: {
            result: { type: 'string', pattern: 'success' },
          },
        },
      },
    },
  };

  router.post<PostEvent>('/event', opts['post-event'], async (req, res) => {
    const { eventType, eventData } = req.body;

    console.log({ eventType, eventData });

    if (eventType === 'CommentModerated') {
      const { id, postId, status } = eventData;

      const commentsItem = allComments.find((item) => item.postId === postId);

      if (!commentsItem) return;

      const comment = commentsItem.comments.find(
        (comment) => comment.id === id
      );

      if (!comment) return;

      comment.status = status;

      try {
        await axios.post(`${eventBusApiOrigin}/event`, {
          eventType: 'CommentUpdated',
          eventData: { ...comment, postId },
        });
      } catch (e: any) {
        req.log.error(`Error occured for Post to event-bus: ${e.message}`);
      }
    }

    res.code(201);
    return { result: 'success' };
  });
}
