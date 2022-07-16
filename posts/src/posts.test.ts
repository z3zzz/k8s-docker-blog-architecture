import Fastify from 'fastify';
import { postRoutes } from './posts';

const app = Fastify();
app.register(postRoutes);

describe('posts api test', () => {
  const newPost = { title: 'this is a post' };

  it('Post /posts - sends {result: success} in json', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/posts',
      payload: newPost,
    });

    const body = JSON.parse(res.body);

    expect(res.statusCode).toBe(201);
    expect(body.result).toBe('success');
  });

  it('GET /posts sends [{result: true}] in json', async () => {
    const res = await app.inject({
      method: 'GET',
      url: '/posts',
    });

    const body = JSON.parse(res.body);
    const elem = expect.objectContaining(newPost);
    const arr = expect.arrayContaining([elem]);

    expect(res.statusCode).toBe(200);
    expect(body).toEqual(arr);
  });
});
