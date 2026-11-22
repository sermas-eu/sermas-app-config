import { env } from '@/common/utils/envConfig';
import { SermasApiClient } from '@sermas/api-client';
import type { Request } from 'express';
import { StatusCodes } from 'http-status-codes';

/**
 * A client for one request, acting as the caller: the wizard holds no account
 * of its own. Built without `login()`, so it starts no refresh timer.
 */
export const sermasClient = (accessToken?: string) =>
  new SermasApiClient({
    baseURL: env.SERMAS_URL,
    access_token: accessToken,
  });

/** The bearer token of the request, if any. */
export const bearerToken = (req: Request): string | undefined => {
  const header = req.headers.authorization;
  if (!header) return undefined;
  const [scheme, token] = header.split(' ');
  return scheme?.toLowerCase() === 'bearer' && token ? token : undefined;
};

/** The HTTP status of a failed API call (the generated client's ApiError). */
export const apiErrorStatus = (e: unknown): number | undefined => {
  const status = (e as { status?: unknown })?.status;
  return typeof status === 'number' ? status : undefined;
};

/** 401/403 from the API pass through; anything else is the wizard's failure. */
export const failureStatus = (e: unknown): number => {
  const status = apiErrorStatus(e);
  return status === StatusCodes.UNAUTHORIZED || status === StatusCodes.FORBIDDEN
    ? status
    : StatusCodes.INTERNAL_SERVER_ERROR;
};
