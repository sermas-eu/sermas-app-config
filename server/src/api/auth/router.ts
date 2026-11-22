import { ServiceResponse } from '@/common/models/serviceResponse';
import { validateRequest } from '@/common/utils/httpHandlers';
import { apiErrorStatus, sermasClient } from '@/common/utils/sermas';
import express, { type Request, type Response, type Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import { z } from 'zod';

export const LoginSchema = z.object({
  body: z.object({
    username: z.string().min(1),
    password: z.string().min(1),
  }),
});

/**
 * POST /api/login: the platform's username/password login, passed through to the
 * SERMAS API. The tokens go back to the browser; the wizard keeps nothing.
 */
export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body as {
    username: string;
    password: string;
  };
  try {
    const token = await sermasClient().api.authentication.login({
      // appId is optional for the API (platform login); the generated type requires it
      requestBody: {
        username,
        password,
        appId: undefined as unknown as string,
      },
    });
    const response = ServiceResponse.success('Logged in', {
      access_token: token.access_token,
      expires_in: token.expires_in,
    });
    res.status(response.statusCode).send(response);
  } catch (e) {
    const status = apiErrorStatus(e);
    const response =
      status === StatusCodes.UNAUTHORIZED || status === StatusCodes.FORBIDDEN
        ? ServiceResponse.failure(
            'Invalid credentials',
            null,
            StatusCodes.UNAUTHORIZED,
          )
        : ServiceResponse.failure(
            'Login failed',
            null,
            StatusCodes.BAD_GATEWAY,
          );
    res.status(response.statusCode).send(response);
  }
};

export const authRouter: Router = express.Router();

authRouter.post('/login', validateRequest(LoginSchema), login);
