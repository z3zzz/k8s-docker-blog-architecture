import {
  FastifyInstance,
  FastifyPluginOptions,
  RouteShorthandOptions,
} from 'fastify';
import axios from 'axios';
import { postApiOrigin, commentApiOrigin, serviceApiOrigin } from './constants';

interface PostEvent {
  Body: {
    eventType: 'PostCreated' | 'CommentCreated';
    eventData: any;
  };
  Reply: {
    result: 'success';
  };
}

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
            pattern: '(PostCreated|CommentCreated)',
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

    axios.post(`${postApiOrigin}/event`, eventData);
    axios.post(`${commentApiOrigin}/event`, eventData);
    axios.post(`${serviceApiOrigin}/event`, eventData);

    res.code(201);
    return { result: 'success' };
  });
}
