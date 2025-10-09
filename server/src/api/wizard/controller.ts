import type { Request, RequestHandler, Response } from 'express';

import { appService } from './service';

class AppController {
  public create: RequestHandler = async (req: Request, res: Response) => {
    const serviceResponse = await appService.create((req as any).files);
    res.status(serviceResponse.statusCode).send(serviceResponse);
  };
}

export const appController = new AppController();
