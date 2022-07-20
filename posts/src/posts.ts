import {
  FastifyInstance,
  FastifyPluginOptions,
  RouteShorthandOptions,
} from 'fastify';
import axios from 'axios';
import { eventBusApiOrigin } from './constants';

interface Post {
  id: string;
  title: string;
}

interface GetPost {
  Reply: Post[];
}

const posts: Post[] = [];

export async function postRoutes(
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
            },
          },
        },
      },
    },
  };

  router.get<GetPost>('/posts', opts['get-posts'], async (req, res) => {
    return posts;
  });

  interface PostPosts {
    Body: {
      id: string;
      title: string;
    };
    Reply: {
      result: 'success';
    };
  }

  opts['post-posts'] = {
    schema: {
      body: {
        type: 'object',
        properties: {
          title: { type: 'string' },
          id: { type: 'string' },
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

  router.post<PostPosts>('/post', opts['post-posts'], async (req, res) => {
    const { id, title } = req.body;

    posts.push({ id, title });

    try {
      await axios.post(`${eventBusApiOrigin}/event`, {
        eventType: 'PostCreated',
        eventData: { id, title },
      });
    } catch (e: any) {
      req.log.error(`Error occured for Post to event-bus: ${e.message}`);
    }

    res.code(201);
    return { result: 'success' };
  });
}
