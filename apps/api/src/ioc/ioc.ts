import { internalContainer } from '@repo/api-common/utils/ioc.utils';
import { IocContainer, ServiceIdentifier } from '@tsoa/runtime/dist/interfaces/iocModule';

class Ioc implements IocContainer {
  get<T>(controller: ServiceIdentifier<T>): T {
    return internalContainer.getAsync(controller) as unknown as T;
  }
}

// NOTE: This must be exported as `iocContainer`
export const iocContainer = new Ioc();
