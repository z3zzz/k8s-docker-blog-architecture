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
  moderationApiOrigin,
} from './constants';

interface PostEvent {
  Body: {
    eventType:
      | 'PostCreated'
      | 'CommentCreated'
      | 'CommentUpdated'
      | 'CommentModerated';
    eventData: any;
  };
  Reply: {
    result: 'success';
  };
}

const SUBSCRIBERS = [commentApiOrigin, queryApiOrigin, moderationApiOrigin];

export async function eventBusRoutes(
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
            pattern:
              '(PostCreated|CommentCreated|CommentUpdated|CommentModerated)',
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

    for (const origin of SUBSCRIBERS) {
      try {
        axios.post(`${origin}/event`, {
          eventType,
          eventData,
        });
      } catch (e: any) {
        console.error(`Error occured in Post ${origin}: ${e.message}`);
      }
    }

    res.code(201);
    return { result: 'success' };
  });
}
