import { databaseConfig } from '@repo/api-common/config/database';
import { internalContainer } from '@repo/api-common/utils/ioc.utils';
import { dataSourceFactory } from '@repo/api-repository/utils/connection';

import { UserProcess } from './process/user';
import { iocSetup } from './ioc/setup';
import { createLogger, LogLevel } from '@repo/api-common/utils/logger.utils';
import { ArrayInsightsService } from './service/arrayInsights';
import { UserService } from './service/user';

const serviceName = 'processJob';

const logger = createLogger(serviceName);
if (process.env.LOG_LEVEL) {
  logger.level(process.env.LOG_LEVEL as LogLevel);
}

async function run() {
  iocSetup(logger);

  logger.info(`Running...`);

  // Process data
  const userProcess = internalContainer.get(UserProcess);
  const users = await userProcess.process();

  // Log results
  const arrayInsights = internalContainer.get(ArrayInsightsService);
  logger.info('advocacyProgramIds');
  arrayInsights.run(
    users.flatMap(user =>
      user.advocacy_programs.map(advocacy_program => advocacy_program.program_id).filter(f => f !== '')
    )
  );

  logger.info('userIds');
  arrayInsights.run(users.map(user => user.user_id).filter(f => f !== null));

  logger.info('emails');
  arrayInsights.run(users.map(user => user.email).filter(f => f !== 'invalid-email' && f !== null && f !== ''));

  logger.info('names');
  arrayInsights.run(users.map(user => user.name).filter(f => f !== '???'));

  logger.info('brands');
  arrayInsights.run(users.flatMap(user => user.advocacy_programs.map(advocacy_program => advocacy_program.brand)));

  // Insert users into db
  const userService = internalContainer.get(UserService);
  const dataSource = await dataSourceFactory(databaseConfig());
  await dataSource.transaction().execute(async tx => {
    await userService.insertMany({ tx }, users, serviceName);
  });
}

run()
  .then(() => logger.info('🚀 Done 🚀'))
  .catch(err => {
    logger.fatal(err);
    process.exit(-1);
  });
