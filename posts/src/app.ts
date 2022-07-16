import Fastify, {
  FastifyInstance,
  FastifyPluginOptions,
  RouteShorthandOptions,
} from 'fastify';
import cors from '@fastify/cors';
import { postRoutes } from './posts';

export const app = Fastify({
  logger: true,
});

app.register(cors, {
  origin: [/localhost/, /postman/],
});

app.register(routes);
app.register(postRoutes);

async function routes(router: FastifyInstance, options: FastifyPluginOptions) {
  const opts: { [keys: string]: RouteShorthandOptions } = {};

  // json schema for data validation
  opts['/'] = {
    schema: {
      response: {
        200: {
          type: 'object',
          properties: {
            greeting: { type: 'string' },
          },
        },
      },
    },
  };

  router.get('/', opts['/'], async (req, res) => {
    return { greeting: 'Hi! It works!' };
  });

  interface PostExampleApiType {
    Body: {
      index: number;
    };
    Reply: {
      result: boolean;
    };
  }

  opts['post-example'] = {
    schema: {
      body: {
        type: 'object',
        properties: {
          index: { type: 'integer' },
        },
      },
      response: {
        201: {
          type: 'object',
          properties: {
            result: { type: 'boolean' },
          },
        },
      },
    },
  };

  router.post<PostExampleApiType>(
    '/post-example',
    opts['post-example'],
    async (req, res) => {
      const index = req.body.index;

      if (index > 40) {
        res.code(422);
        throw new Error('Index too high, should be lower than 40');
      }

      res.code(201);
      return { result: true };
    }
  );
}
