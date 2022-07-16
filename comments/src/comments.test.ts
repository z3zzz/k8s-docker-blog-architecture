import Fastify from 'fastify';
import { commentRoutes } from './comments';

const app = Fastify();
app.register(commentRoutes);

describe('comments api test', () => {
  const postId = 'dk2dvla';
  const comment = 'this is a post';
  const newComment = { postId, comment };

  it('Post /comment - sends {result: success} in json', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/comment',
      payload: newComment,
    });

    const body = JSON.parse(res.body);

    expect(res.statusCode).toBe(201);
    expect(body.result).toBe('success');
  });

  it('GET /comments sends [newComment] in json', async () => {
    const res = await app.inject({
      method: 'GET',
      url: '/comments',
      query: { postId },
    });

    const body = JSON.parse(res.body);
    const elem = expect.objectContaining({ comment });
    const arr = expect.arrayContaining([elem]);

    expect(res.statusCode).toBe(200);
    expect(body).toEqual(arr);
  });
});
