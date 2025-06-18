import { databaseConfig } from '@repo/api-common/config/database';
import { CoreIoc } from '@repo/api-common/types/ioc.types';
import { internalContainer } from '@repo/api-common/utils/ioc.utils';
import { createLogger, Logger, LogLevel } from '@repo/api-common/utils/logger.utils';
import { generateUUID } from '@repo/api-common/utils/uuid.utils';
import { UserRepository } from '@repo/api-repository/user.repository';
import { dataSourceFactory } from '@repo/api-repository/utils/connection';

import { UserProcess } from './process/user';

const createdBy = 'processJob';
const logger = createLogger('processJob');

async function run() {
  if (process.env.LOG_LEVEL) {
    logger.level(process.env.LOG_LEVEL as LogLevel);
  }
  logger.info(`Running...`);

  internalContainer.bind<Logger>(CoreIoc.Logger).toConstantValue(logger);
  internalContainer.bind(UserProcess).toSelf();
  const userProcess = internalContainer.get(UserProcess);
  const users = await userProcess.process();

  logger.info('advocacyProgramIds');
  arrayInsights(
    users.flatMap(user =>
      user.advocacy_programs.map(advocacy_program => advocacy_program.program_id).filter(f => f !== '')
    )
  );

  logger.info('userIds');
  arrayInsights(users.map(user => user.user_id).filter(f => f !== null));

  logger.info('emails');
  arrayInsights(users.map(user => user.email).filter(f => f !== 'invalid-email' && f !== null && f !== ''));

  logger.info('names');
  arrayInsights(users.map(user => user.name).filter(f => f !== '???'));

  logger.info('brands');
  arrayInsights(users.flatMap(user => user.advocacy_programs.map(advocacy_program => advocacy_program.brand)));

  const dataSource = await dataSourceFactory(databaseConfig());
  internalContainer.bind(UserRepository).toSelf();
  const userRepository = internalContainer.get(UserRepository);
  await dataSource.transaction().execute(async tx => {
    const batchCount = 100;
    for (let i = 0; i < users.length; i += batchCount) {
      await userRepository.createMany(
        { tx },
        users.slice(i, i + batchCount).map(user => ({
          id: generateUUID(),
          userId: user.user_id,
          name: user.name,
          email: user.email,
          instagramHandle: user.instagram_handle,
          tiktokHandle: user.tiktok_handle,
          joinedAt: user.joined_at,
          createdBy,
          createdOn: new Date().toISOString(),
          updatedBy: createdBy,
          updatedOn: new Date().toISOString(),
        }))
      );
    }
  });
}

const arrayInsights = <T>(arr: T[]) => {
  const duplicates: T[] = [];
  const unique = arr.reduce<T[]>((acc, el) => {
    if (!acc.includes(el)) {
      acc.push(el);
    } else {
      duplicates.push(el);
    }
    return acc;
  }, []);

  logger.info(`length ${arr.length}`);
  logger.info(`unique length ${unique.length}`);
  logger.info(`duplicates length ${duplicates.length}`);
  if (duplicates.length < 20 && duplicates.length > 0) {
    logger.info(`duplicates ${JSON.stringify(duplicates)}`);
  }
  logger.info(' ');
};

run()
  .then(() => logger.info('🚀 Done 🚀'))
  .catch(err => {
    logger.fatal(err);
    process.exit(-1);
  });
