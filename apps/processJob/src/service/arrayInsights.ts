import { CoreIoc } from '@repo/api-common/types/ioc.types';
import type { Logger } from '@repo/api-common/utils/logger.utils';
import { inject, injectable } from 'inversify';

@injectable()
export class ArrayInsightsService {
  constructor(@inject(CoreIoc.Logger) private logger: Logger) {}

  run<T>(arr: T[]) {
    const duplicates: T[] = [];
    const unique = arr.reduce<T[]>((acc, el) => {
      if (!acc.includes(el)) {
        acc.push(el);
      } else {
        duplicates.push(el);
      }
      return acc;
    }, []);

    this.logger.info(`length ${arr.length}`);
    this.logger.info(`unique length ${unique.length}`);
    this.logger.info(`duplicates length ${duplicates.length}`);
    if (duplicates.length < 20 && duplicates.length > 0) {
      this.logger.info(`duplicates ${JSON.stringify(duplicates)}`);
    }
    this.logger.info(' ');
  }
}
