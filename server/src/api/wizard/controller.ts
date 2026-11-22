import type { Request, RequestHandler, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { ServiceResponse } from '@/common/models/serviceResponse';
import { bearerToken } from '@/common/utils/sermas';
import { appService } from './service';

class AppController {
  // the app is created as the logged-in user (Authorization: Bearer)
  public create: RequestHandler = async (req: Request, res: Response) => {
    const token = bearerToken(req);
    const serviceResponse = token
      ? await appService.create(token, (req as any).files)
      : ServiceResponse.failure('Login required', null, StatusCodes.UNAUTHORIZED);
    res.status(serviceResponse.statusCode).send(serviceResponse);
  };
}

export const appController = new AppController();
