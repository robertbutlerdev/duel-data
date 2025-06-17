import { Tx } from '@repo/api-entity/kysely';

export interface IUpdatedOnAndBy {
  updatedOn: string;
  updatedBy: string;
}

export interface ICreatedOnAndBy {
  createdOn: string;
  createdBy: string;
}

export interface IDataResponse<T> {
  data: Array<T>;
  count: number;
}

export interface IDataContext {
  tx: Tx;
}

export interface RequestHeaders {
  headers: Record<string, string | string[] | undefined>;
}

export interface IDataContextProvider {
  fromRequest<TDataToReturn>(
    req: RequestHeaders,
    action: (context: IDataContext) => Promise<TDataToReturn>
  ): Promise<TDataToReturn>;
}

export interface IPagination {
  limit?: number;
  offset?: number;
}
