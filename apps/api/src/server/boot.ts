import { databaseConfig } from '@repo/api-common/config/database';
import { CoreIoc } from '@repo/api-common/types/ioc.types';
import { DataContextProvider } from '@repo/api-common/utils/context.utils';
import { internalContainer } from '@repo/api-common/utils/ioc.utils';
import { createLogger, Logger, LogLevel } from '@repo/api-common/utils/logger.utils';
import { UserRepository } from '@repo/api-repository/user.repository';
import { dataSourceFactory } from '@repo/api-repository/utils/connection';

import { apiConfig } from '../config/api';
import { UserController } from '../controller/user.controller';
import { createExpressApp, IExpressSetup } from './api';

export function protectedBoot(func: () => Promise<void>): void {
  func().catch(e => {
    // eslint-disable-next-line no-console -- simplest way to provide quick feedback when API fails to boot
    console.error(e, 'Fatal error during api boot', 'Exiting process');
    process.exit(1);
  });
}

export async function boot(name: string, setup: IExpressSetup) {
  const logger = createLogger(name);
  const config = apiConfig();

  if (process.env.LOG_LEVEL) {
    logger.level(process.env.LOG_LEVEL as LogLevel);
  }
  logger.info(`Running...`);

  const dataSource = await dataSourceFactory(databaseConfig());
  internalContainer.bind<Logger>(CoreIoc.Logger).toConstantValue(logger);
  internalContainer.bind(CoreIoc.Datasource).toConstantValue(dataSource);
  internalContainer.bind(UserRepository).toSelf();
  internalContainer.bind(DataContextProvider).toSelf();
  internalContainer.bind(UserController).toSelf();

  const app = createExpressApp(setup);
  app.listen(config.port, () => logger.info(`Listening on port ${config.port}`));

  return app;
}
