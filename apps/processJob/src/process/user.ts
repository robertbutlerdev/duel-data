import { CoreIoc } from '@repo/api-common/types/ioc.types';
import type { Logger } from '@repo/api-common/utils/logger.utils';
import { MethodLogger } from '@repo/api-common/utils/methodLogger.utils';
import { readdir, readFile } from 'fs/promises';
import { inject, injectable } from 'inversify';

import { IUser } from '../typings/user';
import { validateUser, validateUsers } from '../validate/user';

function isSuccess(val: IProcessOneSuccess | IProcessOneFail): val is IProcessOneSuccess {
  return (val as IProcessOneSuccess).user !== undefined;
}

function isFail(val: IProcessOneSuccess | IProcessOneFail): val is IProcessOneFail {
  return (val as IProcessOneFail).error !== undefined;
}

interface IProcessOneBase {
  filePath: string;
}

interface IProcessOneSuccess extends IProcessOneBase {
  user: IUser;
}

interface IProcessOneFail extends IProcessOneBase {
  error: unknown;
}

@injectable()
export class UserProcess {
  private pathPrefix = './data/mixed';
  constructor(@inject(CoreIoc.Logger) private logger: Logger) {}

  @MethodLogger
  async process(): Promise<IUser[]> {
    const files = await readdir(this.pathPrefix, { encoding: 'utf-8' });
    const usersRes: (IProcessOneSuccess | IProcessOneFail)[] = await Promise.all(
      files.map(async file => this.processOne(file))
    );
    const processed = usersRes.filter(res => isSuccess(res)).map(m => m.user);
    const failed = usersRes.filter(res => isFail(res));
    this.logger.warn(`${failed.length} failed to process`);

    // Validate performed on each and all to see what the time difference is
    this.validateEach(processed);
    return this.validateAll(processed);
  }

  @MethodLogger
  private validateEach(users: IUser[]): void {
    users.forEach(user => validateUser(user));
  }

  @MethodLogger
  private validateAll(users: IUser[]): IUser[] {
    return validateUsers(users);
  }

  private async processOne(filePath: string): Promise<IProcessOneSuccess | IProcessOneFail> {
    const path = `${this.pathPrefix}/${filePath}`;
    const res = await readFile(path, { encoding: 'utf-8' });
    try {
      return { user: JSON.parse(res), filePath };
    } catch (e: unknown) {
      const err = e as { message?: string };

      // Missing end `}` on some files
      if (err.message && err.message.startsWith(`Expected ',' or '}' after property value in JSON at position`)) {
        try {
          return { user: JSON.parse(`${res}}`), filePath };
        } catch (newErr) {
          return { filePath, error: newErr };
        }
      } else {
        return { filePath, error: e };
      }
    }
  }
}
