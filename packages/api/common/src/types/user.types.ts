import { ICreatedOnAndBy, IDataContext, IDataResponse, IUpdatedOnAndBy } from './core.types';

export interface IUserCore {
  id: string;
  userId: string | null;
  email: string | null;
  name: string | null;
  instagramHandle: string | null;
  tiktokHandle: string | null;
  joinedAt: string | null;
}

export type IUser = IUserCore & ICreatedOnAndBy & IUpdatedOnAndBy;

export interface ICreateUserDTO extends Omit<IUserCore, 'id'> {}

export type TUserResponse = IDataResponse<IUserCore>;

export interface IUserRepository {
  create(context: IDataContext, data: IUser): Promise<boolean>;
  get(context: IDataContext, pagination: { limit?: number; offset?: number }): Promise<IUserCore[]>;
}
