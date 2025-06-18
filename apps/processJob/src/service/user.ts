import { inject, injectable } from 'inversify';
import { UserRepository } from '@repo/api-repository/user.repository';

import { IUser } from '../typings/user';
import { generateUUID } from '@repo/api-common/utils/uuid.utils';
import { IDataContext } from '@repo/api-common/types/core.types';

@injectable()
export class UserService {
  constructor(@inject(UserRepository) private userRepository: UserRepository) {}

  async insertMany(context: IDataContext, users: IUser[], serviceName: string) {
    // Batch insert into DB to improve speed
    const batchCount = 100;
    for (let i = 0; i < users.length; i += batchCount) {
      await this.userRepository.createMany(
        context,
        users.slice(i, i + batchCount).map(user => ({
          id: generateUUID(),
          userId: user.user_id,
          name: user.name,
          email: user.email,
          instagramHandle: user.instagram_handle,
          tiktokHandle: user.tiktok_handle,
          joinedAt: user.joined_at,
          createdBy: serviceName,
          createdOn: new Date().toISOString(),
          updatedBy: serviceName,
          updatedOn: new Date().toISOString(),
        }))
      );
    }
  }
}
