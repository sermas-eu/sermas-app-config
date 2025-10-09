import { getLogger } from '@/common/logger';
import { ServiceResponse } from '@/common/models/serviceResponse';
import { env } from '@/common/utils/envConfig';
import { logger } from '@/server';
import {
  CreatePlatformAppDto,
  RepositoryAvatarDto,
  RepositoryBackgroundDto,
  RepositoryDocumentDto,
  SermasApiClient,
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
  private sermas: SermasApiClient;
  constructor() {
    this.sermas = new SermasApiClient({
      baseURL: env.SERMAS_URL,
      clientId: env.SERMAS_CLIENT_ID,
      clientSecret: env.SERMAS_CLIENT_SECRET,
      appId: env.SERMAS_APPID,
    });
  }

  // Retrieves all users from the database
  async create(files: UploadedItem[]): Promise<ServiceResponse<any | null>> {
    try {
      // await this.init();

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

      const result = await this.createApp(upload.config);

      return ServiceResponse.success<any>('Created', result);
      // return ServiceResponse.success<SermasApp>('Created', assistant);
    } catch (ex) {
      const errorMessage = `Error creating the assistant: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        'Error creating the assistant',
        null,
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async createApp(data: any) {
    this.logger.debug(`Received ${JSON.stringify(data, null, 2)}`);
    const assistant = SermasAppSchema.parse(data);

    await this.sermas.loadToken(env.SERMAS_CLIENT_ID, env.SERMAS_CLIENT_SECRET);
    const res = await this.sermas.login(env.SERMAS_USER, env.SERMAS_PASSWORD);

    const client = new SermasApiClient({
      baseURL: env.SERMAS_URL,
      access_token: res.access_token,
    });

    const user = await client.api.authentication.whoami();

    const chatModel = assistant.settings?.chatModel || 'groq';
    const selectedModel = chatModel.indexOf('groq')
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
          // # model for summarization tasks
          summary: 'groq/openai/gpt-oss-120b',
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
      if (backgroundData) {
        this.logger.info(`Saving asset ${background}`);
        await client.api.ui.saveAsset({
          formData: {
            file: backgroundData,
            appId: newApp.appId,
            filename: 'background.jpg',
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
