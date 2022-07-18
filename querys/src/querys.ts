import {
  FastifyInstance,
  FastifyPluginOptions,
  RouteShorthandOptions,
} from 'fastify';

interface Comment {
  id: string;
  content: string;
}

interface EventComment {
  postId: string;
  id: string;
  content: string;
}

interface Post {
  id: string;
  title: string;
  comments: Comment[];
}

interface EventPost {
  id: string;
  title: string;
}

interface GetPosts {
  Reply: Post[];
}

interface PostEvent {
  Body: {
    eventType: 'PostCreated' | 'CommentCreated';
    eventData: EventPost | EventComment;
  };
  Reply: {
    result: 'success';
  };
}

const posts: Post[] = [];

export async function queryRoutes(
  router: FastifyInstance,
  options: FastifyPluginOptions
) {
  const opts: { [keys: string]: RouteShorthandOptions } = {};

  // json schema for data validation
  opts['get-posts'] = {
    schema: {
      response: {
        200: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              title: { type: 'string' },
              comments: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    id: { type: 'string' },
                    content: { tpe: 'string' },
                  },
                },
              },
            },
          },
        },
      },
    },
  };

  router.get<GetPosts>('/posts', opts['get-posts'], async (req, res) => {
    return posts;
  });

  opts['post-event'] = {
    schema: {
      body: {
        type: 'object',
        properties: {
          eventType: {
            type: 'string',
            pattern: '(PostCreated|CommentCreated)',
          },
          eventData: {
            type: 'object',
            anyOf: [
              {
                properties: {
                  postId: { type: 'string' },
                  id: { type: 'string' },
                  content: { type: 'string' },
                },
              },
              {
                properties: {
                  id: { type: 'string' },
                  title: { type: 'string' },
                },
              },
            ],
          },
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

    if (eventType === 'PostCreated') {
      const newPost = eventData as EventPost;

      posts.push({ ...newPost, comments: [] });
    }

    if (eventType === 'CommentCreated') {
      const newComment = eventData as EventComment;
      const commentedPost = posts.find((post) => (post.id = newComment.postId));

      if (commentedPost) {
        commentedPost.comments.push(newComment);
      }
    }

    res.code(201);
    return { result: 'success' };
  });
}
