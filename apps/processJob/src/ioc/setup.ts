import { CoreIoc } from '@repo/api-common/types/ioc.types';
import { internalContainer } from '@repo/api-common/utils/ioc.utils';
import { Logger } from '@repo/api-common/utils/logger.utils';
import { UserRepository } from '@repo/api-repository/user.repository';

import { UserProcess } from '../process/user';
import { ArrayInsightsService } from '../service/arrayInsights';
import { UserService } from '../service/user';

export const iocSetup = (logger: Logger) => {
  internalContainer.bind<Logger>(CoreIoc.Logger).toConstantValue(logger);
  internalContainer.bind(UserProcess).toSelf();
  internalContainer.bind(ArrayInsightsService).toSelf();
  internalContainer.bind(UserService).toSelf();
  internalContainer.bind(UserRepository).toSelf();
};
