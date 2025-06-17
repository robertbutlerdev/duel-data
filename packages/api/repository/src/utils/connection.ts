import { IDatabaseConfig } from '@repo/api-common/config/database';
import { DataSource } from '@repo/api-entity/kysely';
import { DB } from '@repo/api-entity/types.generated';
import { Kysely, MssqlDialect } from 'kysely';
import * as tarn from 'tarn';
import * as tedious from 'tedious';

export async function dataSourceFactory(database: IDatabaseConfig): Promise<DataSource> {
  return new Kysely<DB>({
    log: ['query', 'error'],
    dialect: new MssqlDialect({
      tarn: {
        ...tarn,
        options: {
          min: 0,
          max: 10,
        },
      },
      tedious: {
        ...tedious,
        connectionFactory: () =>
          new tedious.Connection({
            authentication: {
              options: {
                password: database.password,
                userName: database.username,
              },
              type: 'default',
            },
            options: {
              database: database.name,
              port: database.port,
              trustServerCertificate: true,
            },
            server: database.host,
          }),
      },
    }),
  });
}
