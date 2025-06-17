import { type IDataContext } from '@repo/api-common/types/core.types';
import { IUser, IUserCore, IUserRepository } from '@repo/api-common/types/user.types';
import { MethodLogger } from '@repo/api-common/utils/methodLogger.utils';
import { sql } from 'kysely';

export class UserRepository implements IUserRepository {
  async create(context: IDataContext, data: IUser): Promise<boolean> {
    const res = await context.tx
      .withSchema('duel_data')
      .insertInto('user')
      .values({
        id: data.id,
        user_id: data.userId,
        email: data.email,
        name: data.name,
        instagram_handle: data.instagramHandle,
        tiktok_handle: data.tiktokHandle,
        joined_at: data.joinedAt,
        created_by: data.createdBy,
        created_on: data.createdOn,
        updated_by: data.updatedBy,
        updated_on: data.updatedOn,
      })
      .executeTakeFirst();
    return (res.numInsertedOrUpdatedRows && res.numInsertedOrUpdatedRows > 0) || false;
  }

  async createMany(context: IDataContext, data: IUser[]): Promise<boolean> {
    const res = await context.tx
      .withSchema('duel_data')
      .insertInto('user')
      .values(
        data.map(d => ({
          id: d.id,
          user_id: d.userId,
          email: d.email,
          name: d.name,
          instagram_handle: d.instagramHandle,
          tiktok_handle: d.tiktokHandle,
          joined_at: d.joinedAt,
          created_by: d.createdBy,
          created_on: d.createdOn,
          updated_by: d.updatedBy,
          updated_on: d.updatedOn,
        }))
      )
      .executeTakeFirst();
    return (res.numInsertedOrUpdatedRows && res.numInsertedOrUpdatedRows > 0) || false;
  }

  @MethodLogger
  async get(context: IDataContext, pagination: { limit: number; offset: number }): Promise<IUserCore[]> {
    const query = context.tx
      .withSchema('duel_data')
      .selectFrom('user')
      .select([
        'id',
        'user_id as userId',
        'name',
        'email',
        'instagram_handle as instagramHandle',
        'tiktok_handle as tiktokHandle',
        'joined_at as joinedAt',
      ])
      .orderBy('id', 'asc')
      .modifyEnd(sql`OFFSET ${pagination.offset} ROWS FETCH NEXT ${pagination.limit} ROWS ONLY`)
      .execute();

    // console.log(query);

    return query;
  }
}
