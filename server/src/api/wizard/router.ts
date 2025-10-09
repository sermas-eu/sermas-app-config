import express, { type Router } from 'express';
import multer from 'multer';
import { appController } from './controller';

const upload = multer();

export const appRouter: Router = express.Router();

appRouter.post('/wizard', upload.any(), appController.create);
