import { UTCDate } from '@date-fns/utc';
import { z } from 'zod/v4';

import { IUser } from '../typings/user';

const userSchema = z
  .object({
    email: z.string(),
    user_id: z.string().nullable(),
    name: z.string(),
    tiktok_handle: z.string(),
    instagram_handle: z.string().nullable(),
    joined_at: z.string().transform(str => {
      const parsedDate = new UTCDate(str);
      return isNaN(parsedDate.getTime()) ? null : parsedDate.toISOString();
    }),
    advocacy_programs: z.array(
      z
        .object({
          program_id: z.string(),
          brand: z.coerce.string().nullable(),
          tasks_completed: z.array(
            z
              .object({
                task_id: z.string().nullable(),
                platform: z.coerce.string().nullable(),
                post_url: z.string(),
                likes: z.any().transform(str => Number(str)),
                comments: z.number().nullable(),
                shares: z.number(),
                reach: z.number(),
              })
              .strict()
          ),
          total_sales_attributed: z.any().transform(str => Number(str)),
        })
        .strict()
    ),
  })
  .strict();

export function validateUser(user: IUser): IUser {
  return userSchema.parse(user);
}

export function validateUsers(users: IUser[]): IUser[] {
  return userSchema.array().parse(users);
}
