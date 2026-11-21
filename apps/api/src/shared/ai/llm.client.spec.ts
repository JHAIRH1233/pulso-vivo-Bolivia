import {
  BadGatewayException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { LlmClient } from './llm.client';

describe('LlmClient', () => {
  let client: LlmClient;
  const settings: Record<string, string> = {
    LLM_API_KEY: 'test-key',
    LLM_BASE_URL: 'https://llm.example/v1',
    LLM_MODEL: 'test-model',
  };
  const configService = {
    get: jest.fn((name: string) => settings[name]),
  };

  beforeEach(async () => {
    settings.LLM_API_KEY = 'test-key';
    settings.LLM_BASE_URL = 'https://llm.example/v1';
    settings.LLM_MODEL = 'test-model';
    configService.get.mockClear();

    const module = await Test.createTestingModule({
      providers: [
        LlmClient,
        { provide: ConfigService, useValue: configService },
      ],
    }).compile();

    client = module.get(LlmClient);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('sends an authenticated OpenAI-compatible JSON completion request', async () => {
    jest.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(
        JSON.stringify({
          choices: [{ message: { content: '{"ok":true}' } }],
        }),
        { status: 200 },
      ),
    );

    await expect(client.completeJson('system prompt', 'user prompt')).resolves.toBe(
      '{"ok":true}',
    );

    expect(globalThis.fetch).toHaveBeenCalledWith(
      'https://llm.example/v1/chat/completions',
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: 'Bearer test-key',
        }),
        body: expect.stringContaining('"model":"test-model"'),
      }),
    );
  });

  it('reports missing provider configuration', async () => {
    settings.LLM_API_KEY = '';

    await expect(client.completeJson('system prompt', 'user prompt')).rejects.toBeInstanceOf(
      ServiceUnavailableException,
    );
  });

  it('rejects invalid provider responses', async () => {
    jest.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ choices: [] }), { status: 200 }),
    );

    await expect(client.completeJson('system prompt', 'user prompt')).rejects.toBeInstanceOf(
      BadGatewayException,
    );
  });
});
