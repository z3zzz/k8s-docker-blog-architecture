import { app } from './app';

describe('api server test', () => {
  it('Get / - sends greeting message in json', async () => {
    const res = await app.inject({
      method: 'GET',
      url: '/',
    });

    const body = JSON.parse(res.body);

    expect(res.statusCode).toBe(200);
    expect(body.greeting).toMatch(/Hi! It works!/i);
  });

  it('POST /post-example sends {result: true} in json', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/post-example',
      payload: { index: 5 },
    });

    const body = JSON.parse(res.body);

    expect(res.statusCode).toBe(201);
    expect(body.result).toBe(true);
  });
});
