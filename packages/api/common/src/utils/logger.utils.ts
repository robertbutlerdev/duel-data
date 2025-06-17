import * as Bunyan from 'bunyan';
import PrettyStream from 'bunyan-prettystream';

const prettyStdOut = new PrettyStream({ mode: 'long' });
prettyStdOut.pipe(process.stdout);

export const createLogger = (name: string) =>
  Bunyan.createLogger({
    name,
    streams: [
      {
        level: 'info',
        stream: prettyStdOut,
      },
    ],
  });

export type LogLevel = Bunyan.LogLevel;
export type Logger = Bunyan;
