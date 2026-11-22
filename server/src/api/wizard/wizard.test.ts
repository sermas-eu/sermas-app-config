import type { AddressInfo } from 'node:net';
import type { Server } from 'node:http';
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

// the SERMAS API client, as seen by the wizard: one per request
const api = {
  authentication: { login: vi.fn(), whoami: vi.fn() },
  platform: { createApp: vi.fn() },
  ui: { saveAsset: vi.fn() },
};
const sermasClient = vi.fn((_token?: string) => ({ api }));

vi.mock('@/common/utils/sermas', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@/common/utils/sermas')>()),
  sermasClient: (token?: string) => sermasClient(token),
}));

const apiError = (status: number) => Object.assign(new Error(`HTTP ${status}`), { status });

let server: Server;
let base: string;

beforeAll(async () => {
  const { app } = await import('@/server');
  server = app.listen(0);
  base = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
});
afterAll(() => server.close());

beforeEach(() => {
  vi.resetAllMocks();
  sermasClient.mockImplementation(() => ({ api }));
  api.authentication.whoami.mockResolvedValue({ sub: 'user-1' });
  api.platform.createApp.mockResolvedValue({ appId: 'new-app' });
});

const wizard = (config: unknown, token?: string) => {
  const body = new FormData();
  body.append('config', new Blob([JSON.stringify(config)], { type: 'text/json' }), 'config.json');
  return fetch(`${base}/api/wizard`, {
    method: 'POST',
    body,
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
};

describe('POST /api/wizard', () => {
  it('requires a logged-in user', async () => {
    const res = await wizard({ name: 'demo' });
    expect(res.status).toBe(401);
    expect(sermasClient).not.toHaveBeenCalled();
  });

  it('creates the app as the caller, who becomes its owner', async () => {
    const res = await wizard({ name: 'demo' }, 'user-token');
    expect(res.status).toBe(200);
    expect(sermasClient).toHaveBeenCalledWith('user-token');
    const { requestBody } = api.platform.createApp.mock.calls[0][0];
    expect(requestBody.ownerId).toBe('user-1');
    expect(requestBody.name).toBe('demo');
    const json = await res.json();
    expect(json.responseObject).toEqual({
      appId: 'new-app',
      redirect: 'http://sermas.test/new-app',
    });
  });

  it('passes a refusal of the API through', async () => {
    api.platform.createApp.mockRejectedValue(apiError(403));
    const res = await wizard({ name: 'demo' }, 'user-token');
    expect(res.status).toBe(403);
  });

  it('picks the groq model for groq settings', async () => {
    await wizard({ name: 'demo', settings: { chatModel: 'groq' } }, 'user-token');
    const { requestBody } = api.platform.createApp.mock.calls[0][0];
    expect(requestBody.settings.llm.chat).toBe('groq/openai/gpt-oss-120b');
  });
});

describe('POST /api/login', () => {
  const login = (body: unknown) =>
    fetch(`${base}/api/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

  it('passes the credentials to the API and returns the access token', async () => {
    api.authentication.login.mockResolvedValue({
      access_token: 'at',
      refresh_token: 'rt',
      expires_in: 300,
    });
    const res = await login({ username: 'u', password: 'p' });
    expect(res.status).toBe(200);
    expect(sermasClient).toHaveBeenCalledWith(undefined);
    expect(api.authentication.login.mock.calls[0][0].requestBody).toMatchObject({
      username: 'u',
      password: 'p',
    });
    const json = await res.json();
    expect(json.responseObject).toEqual({ access_token: 'at', expires_in: 300 });
  });

  it('answers 401 on wrong credentials', async () => {
    api.authentication.login.mockRejectedValue(apiError(401));
    const res = await login({ username: 'u', password: 'bad' });
    expect(res.status).toBe(401);
  });

  it('rejects a request without a password', async () => {
    const res = await login({ username: 'u' });
    expect(res.status).toBe(400);
    expect(api.authentication.login).not.toHaveBeenCalled();
  });
});
