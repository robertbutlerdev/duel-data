import type { DataSource } from '@repo/api-entity/kysely';
import { inject } from 'inversify';

import { IDataContext, IDataContextProvider, RequestHeaders } from '../types/core.types';
import { CoreIoc } from '../types/ioc.types';

export interface RequestWithCtx extends RequestHeaders {
  ctx: IDataContext;
}

export class DataContextProvider<TRequest extends RequestWithCtx> implements IDataContextProvider {
  constructor(@inject(CoreIoc.Datasource) private dataSource: DataSource) {}

  async fromRequest<TDataToReturn>(
    req: TRequest,
    action: (context: IDataContext) => Promise<TDataToReturn>
  ): Promise<TDataToReturn> {
    return await this.dataSource.transaction().execute(async tx => action({ ...req.ctx, tx }));
  }
}
