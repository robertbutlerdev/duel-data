/**
 * Override the default expressAuthentication function from the swagger-tools module.
 * This dummy override allows us to use bearer auth in the frontend without TSOA interfering.
 */

export function expressAuthentication(_: unknown, __: string, ___?: unknown): Promise<unknown> {
  return Promise.resolve();
}
