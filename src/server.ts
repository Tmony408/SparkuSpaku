import { createApp } from './app';
import { connectDB } from './config/db';
import { assertEnv, env } from './config/env';

async function bootstrap() {
  assertEnv();
  await connectDB();

  const app = createApp();
  app.listen(env.port, () => {
    // eslint-disable-next-line no-console
    console.log(`Server running on :${env.port}`);
  });
}

bootstrap().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});
