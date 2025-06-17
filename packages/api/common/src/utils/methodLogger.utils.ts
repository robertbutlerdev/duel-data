import { CoreIoc } from '../types/ioc.types';
import { internalContainer } from './ioc.utils';
import { Logger } from './logger.utils';

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- allow any
export const MethodLogger = (target: any, methodName: string, descriptor: PropertyDescriptor) => {
  const originalMethod = descriptor.value;
  // new property descriptor
  const newDescriptor: PropertyDescriptor = {
    configurable: true,
    enumerable: false,
    get() {
      const logger = internalContainer.get<Logger>(CoreIoc.Logger);

      const methodStartTime = Date.now();
      const name = `[${target.constructor.name}].[${methodName}]`;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any -- allow any
      const preMethod = (args: any[]) => {
        const argsCpy = [...args];
        argsCpy.shift();
        const inputs = JSON.stringify(argsCpy);

        logger.info(`${name} Enter`);
        logger.info({ inputs });
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any -- allow any
      const postMethod = (result: any) => {
        logger.info(`${name} Exit`);
        const jsonResult = JSON.stringify(result);
        logger.info(
          JSON.stringify(
            {
              output: jsonResult && `${jsonResult.substring(0, 1000)}...`,
              executionTime: `${Date.now() - methodStartTime}ms`,
            },
            null,
            4
          )
        );
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any -- allow any
      const newMethodAsync = async (...args: any[]) => {
        preMethod(args);
        const result = await originalMethod.apply(this, args);
        postMethod(result);
        return result;
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any -- allow any
      const newMethod = (...args: any[]) => {
        preMethod(args);
        const result = originalMethod.apply(this, args);
        postMethod(result);
        return result;
      };

      return originalMethod.constructor?.name === 'AsyncFunction' ? newMethodAsync : newMethod;
    },
  };
  return newDescriptor;
};
