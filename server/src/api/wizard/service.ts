import { getLogger } from '@/common/logger';
import { ServiceResponse } from '@/common/models/serviceResponse';
import { env } from '@/common/utils/envConfig';
import { failureStatus, sermasClient } from '@/common/utils/sermas';
import type {
  CreatePlatformAppDto,
  RepositoryAvatarDto,
  RepositoryBackgroundDto,
  RepositoryDocumentDto,
} from '@sermas/api-client';
import { StatusCodes } from 'http-status-codes';
import { SermasAppSchema } from './model';

type UploadedItem = {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  buffer: Buffer;
  size: number;
};

type Upload = {
  config: any;
};

export class AppService {
  private readonly logger = getLogger(AppService.name);

  /** Creates the app as the user who owns `accessToken`. */
  async create(
    accessToken: string,
    files: UploadedItem[],
  ): Promise<ServiceResponse<any | null>> {
    try {
      const upload: Upload = {
        config: null,
      };

      files.forEach((file) => {
        if (file.fieldname === 'config') {
          upload.config = JSON.parse(Buffer.from(file.buffer).toString());
        }
        // console.log(file);
      });

      if (!upload.config) throw new Error('Missing config field');

      const result = await this.createApp(accessToken, upload.config);

      return ServiceResponse.success<any>('Created', result);
      // return ServiceResponse.success<SermasApp>('Created', assistant);
    } catch (ex) {
      this.logger.error(
        `Error creating the assistant: ${(ex as Error).message}`,
      );
      const status = failureStatus(ex);
      return ServiceResponse.failure(
        status === StatusCodes.INTERNAL_SERVER_ERROR
          ? 'Error creating the assistant'
          : 'Not authorized',
        null,
        status,
      );
    }
  }

  async createApp(accessToken: string, data: any) {
    const assistant = SermasAppSchema.parse(data);
    const client = sermasClient(accessToken);

    const user = await client.api.authentication.whoami();

    const chatModel = assistant.settings?.chatModel || 'groq';
    // `indexOf` was 0 (falsy) for "groq…", so groq picked gpt-4.1
    const selectedModel = chatModel.startsWith('groq')
      ? 'groq/openai/gpt-oss-120b'
      : 'openai/gpt-4.1';

    const theme = {
      ...(assistant.settings?.theme || {}),
    };

    let background: string | undefined;
    if (theme.background) {
      background = theme.background;
      delete theme.background;
    }

    let backgroundData: Blob | undefined;
    let backgroundId: string | undefined;
    try {
      if (background && background.startsWith('http')) {
        const req = await fetch(background);
        backgroundData = await req.blob();
        backgroundId = 'background1';
      }
    } catch (e: any) {
      this.logger.error(
        `Failed to download background ${background}: ${e.message}`,
      );
    }

    const avatars: RepositoryAvatarDto[] = [];

    if (assistant.avatars) {
      assistant.avatars.forEach((raw) => {
        const avatar: RepositoryAvatarDto = {
          gender: raw.gender
            ? raw.gender.toLocaleLowerCase().startsWith('m')
              ? 'M'
              : 'F'
            : 'F',
          id: raw.id || 'avatar-' + Date.now(),
          modelType: 'readyplayerme',
          type: 'avatars',
          prompt: raw.prompt || '',
          name: raw.name || 'Avatar',
          path: raw.url!,
        };

        avatars.push({
          ...avatar,
          ...{
            animations: {
              blendShapes: {
                name: 'Wolf3D_Avatar',
              },
            },
          },
        });
      });
    }
    const backgrounds: RepositoryBackgroundDto[] = [];
    if (background && backgroundId) {
      backgrounds.push({
        id: backgroundId,
        path: 'background.jpg',
        type: 'backgrounds',
        name: backgroundId,
      });
    }
    const documents: RepositoryDocumentDto[] = [];

    const app: CreatePlatformAppDto = {
      ownerId: user.sub,
      name: assistant.name,
      description: assistant.description || '',
      settings: {
        language: assistant.settings?.language || 'en-GB',
        avatar: assistant.settings?.avatar || '',
        background: backgroundId || '',
        llm: {
          chat: selectedModel,
          // # model for text based sentiment analysis
          sentiment: 'groq/openai/gpt-oss-120b',
          // # model for tasks and fields analysis and execution
          tasks: 'groq/openai/gpt-oss-120b',
          // # translations specific model
          translation: 'groq/openai/gpt-oss-120b',
        },
        prompt: {
          text: assistant.settings?.prompt?.text || '',
        },
        login:
          assistant.settings?.login === undefined
            ? false
            : assistant.settings?.login,
        theme,
        interactionStart: 'on-load',
      },
      public: assistant.public === undefined ? true : assistant.public,
      modules: [
        {
          moduleId: 'avatar',
          secret:
            '' + Math.random() * Date.now() + '.' + Math.random() * Date.now(),
          supports: ['dialogue', 'detection', 'ui', 'session', 'platform'],
          config: {} as any,
        },
      ],
      clients: [],
      repository: {
        avatars,
        backgrounds,
        documents,
      },
    };

    const newApp = await client.api.platform.createApp({
      requestBody: app,
    });

    // this.logger.debug(newApp);

    try {
      if (backgroundData && backgroundId) {
        this.logger.info(`Saving asset ${background}`);
        await client.api.ui.saveAsset({
          formData: {
            file: backgroundData,
            appId: newApp.appId,
            filename: 'background.jpg',
            path: 'background.jpg',
            id: backgroundId,
            type: 'backgrounds',
          },
        });
      }
    } catch (e) {
      this.logger.error(`Failed to save asset: ${e}`);
    }
    return {
      appId: newApp.appId,
      redirect: `${env.SERMAS_URL}/${newApp.appId}`,
    };
  }
}

export const appService = new AppService();
