import { app } from './app';

const port = parseInt(process.env.QUERYS_PORT || '5002');

app.listen({ port, host: '0.0.0.0' }, (err, url) => {
  if (err) {
    app.log.error(err);
    process.exit(1);
  }
});
