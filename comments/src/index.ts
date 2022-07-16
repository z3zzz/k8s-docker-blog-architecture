import { app } from './app';

const port = parseInt(process.env.COMMENTS_PORT || '5001');

app.listen({ port, host: '0.0.0.0' }, (err, url) => {
  if (err) {
    app.log.error(err);
    process.exit(1);
  }
});
