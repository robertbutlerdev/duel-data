import { RegisterRoutes } from './routes.generated/routes';
import { boot, protectedBoot } from './server/boot';

const getApp = async () => {
  await boot('api', {
    post: app => RegisterRoutes(app),
  });
};

protectedBoot(getApp);
