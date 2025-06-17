import { eslintNode } from '@repo/eslint-config/node';

export default [
  ...eslintNode,
  {
    files: ['**/*.ts'],
  },
];
