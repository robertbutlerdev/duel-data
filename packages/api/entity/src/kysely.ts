import { Kysely, Transaction } from 'kysely';
import { DB } from './types.generated';

export type DataSource = Kysely<DB>;
export type Tx = Transaction<DB>;
