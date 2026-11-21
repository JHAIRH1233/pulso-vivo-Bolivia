import {
  BadGatewayException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { AudioService } from './audio.service';

describe('AudioService', () => {
  let service: AudioService;
  const settings: Record<string, string> = { TTS_API_KEY: 'test-key' };
  const configService = {
    get: jest.fn((name: string) => settings[name]),
  };

  beforeEach(async () => {
    settings.TTS_API_KEY = 'test-key';
    configService.get.mockClear();

    const module = await Test.createTestingModule({
      providers: [
        AudioService,
        { provide: ConfigService, useValue: configService },
      ],
    }).compile();

    service = module.get(AudioService);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('returns base64 MP3 audio from the TTS provider', async () => {
    const audio = new Uint8Array([0x49, 0x44, 0x33]);
    const fetch = jest.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(audio, {
        status: 200,
        headers: { 'content-type': 'audio/mpeg' },
      }),
    );

    await expect(service.synthesize('Quechua text')).resolves.toEqual({
      audioBase64: Buffer.from(audio).toString('base64'),
      mimeType: 'audio/mpeg',
    });

    expect(fetch).toHaveBeenCalledWith(
      'https://api.openai.com/v1/audio/speech',
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: 'Bearer test-key',
        }),
        body: expect.stringContaining('"input":"Quechua text"'),
      }),
    );
  });

  it('reports a missing TTS API key', async () => {
    settings.TTS_API_KEY = '';

    await expect(service.synthesize('Texto')).rejects.toBeInstanceOf(
      ServiceUnavailableException,
    );
  });

  it('rejects provider errors and non-audio responses', async () => {
    jest.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response('provider error', { status: 503 }),
    );

    await expect(service.synthesize('Texto')).rejects.toBeInstanceOf(
      BadGatewayException,
    );

    jest.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response('{}', {
        status: 200,
        headers: { 'content-type': 'application/json' },
      }),
    );

    await expect(service.synthesize('Texto')).rejects.toBeInstanceOf(
      BadGatewayException,
    );
  });
});
