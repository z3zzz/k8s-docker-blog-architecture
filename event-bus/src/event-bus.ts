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

interface Event {
  eventType:
    | 'PostCreated'
    | 'CommentCreated'
    | 'CommentUpdated'
    | 'CommentModerated';
  eventData: any;
}

interface PostEvent {
  Body: Event;
  Reply: {
    result: 'success';
  };
}

interface GetEvents {
  Reply: Event[];
}

const SUBSCRIBERS = [commentApiOrigin, queryApiOrigin, moderationApiOrigin];
const events: Event[] = [];

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
    events.push({ eventType, eventData });

    console.log({ eventType, eventData });

    for (const origin of SUBSCRIBERS) {
      try {
        await axios.post(`${origin}/event`, {
          eventType,
          eventData,
        });
      } catch (e: any) {
        req.log.error(`Error occured for Post to ${origin}: ${e.message}`);
      }
    }

    res.code(201);
    return { result: 'success' };
  });

  opts['get-events'] = {
    schema: {
      response: {
        200: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              eventType: { type: 'string' },
              eventData: {},
            },
          },
        },
      },
    },
  };

  router.get<GetEvents>('/events', opts['get-events'], (req, res) => {
    return events;
  });
}
