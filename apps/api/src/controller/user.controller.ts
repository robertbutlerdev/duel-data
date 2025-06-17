import type { IDataContextProvider, IPagination } from '@repo/api-common/types/core.types';
import type { IUserCore, IUserRepository } from '@repo/api-common/types/user.types';
import { DataContextProvider } from '@repo/api-common/utils/context.utils';
import { paginationWithDefaults } from '@repo/api-common/utils/pagination.utils';
import { UserRepository } from '@repo/api-repository/user.repository';
import { Controller, Get, Queries, Request, Route, Security, Tags } from '@tsoa/runtime';
import * as express from 'express';
import { inject } from 'inversify';

import { bearerAuthScheme } from '../auth/bearerScheme';

@Tags('User')
@Route('v1/users')
@Security(bearerAuthScheme)
export class UserController extends Controller {
  constructor(
    @inject(DataContextProvider) private dataContextProvider: IDataContextProvider,
    @inject(UserRepository) private userRepository: IUserRepository
  ) {
    super();
  }

  @Get()
  public async getUsers(@Request() req: express.Request, @Queries() pagination: IPagination): Promise<IUserCore[]> {
    this.setStatus(200);
    return this.dataContextProvider.fromRequest(req, async ctx =>
      this.userRepository.get(ctx, paginationWithDefaults(pagination))
    );
  }
}
