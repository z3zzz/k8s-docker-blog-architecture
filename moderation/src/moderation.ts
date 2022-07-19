import {
  FastifyInstance,
  FastifyPluginOptions,
  RouteShorthandOptions,
} from 'fastify';
import axios from 'axios';
import {
  postApiOrigin,
  commentApiOrigin,
  queryApiOrigin,
  eventBusApiOrigin,
} from './constants';

interface PostEvent {
  Body: {
    eventType: 'CommentCreated' | 'CommentUpdated';
    eventData: any;
  };
  Reply: {
    result: 'success';
  };
}

type StatusAfterModeration = 'approved' | 'rejected';

const WORDS_TO_BLOCK = ['orange'];

export async function moderationRoutes(
  router: FastifyInstance,
  options: FastifyPluginOptions
) {
  const opts: { [keys: string]: RouteShorthandOptions } = {};

  // json schema for data validation
  opts['post-event'] = {
    schema: {
      body: {
        type: 'object',
        properties: {
          eventType: {
            type: 'string',
          },
          eventData: {},
        },
      },
      response: {
        200: {
          type: 'object',
          properties: {
            result: { type: 'string', pattern: 'success' },
          },
        },
      },
    },
  };

  router.post<PostEvent>('/event', opts['post-event'], (req, res) => {
    const { eventType, eventData } = req.body;

    console.log({ eventType, eventData });

    if (eventType === 'CommentCreated') {
      const status = moderateComment(eventData.content);
      const commentAfterCheck = { ...eventData, status };

      try {
        axios.post(`${eventBusApiOrigin}/event`, {
          eventType: 'CommentModerated',
          eventData: commentAfterCheck,
        });
      } catch (e: any) {
        console.error(`Error occured in Post event-bus: ${e.message}`);
      }
    }

    res.code(201);
    return { result: 'success' };
  });
}

function moderateComment(comment: string): StatusAfterModeration {
  let status: StatusAfterModeration = 'approved';

  for (const word of WORDS_TO_BLOCK) {
    status = comment.includes(word) ? 'rejected' : 'approved';
  }

  return status;
}
