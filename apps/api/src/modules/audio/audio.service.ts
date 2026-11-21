import {
  BadGatewayException,
  Injectable,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SpeechAudioResult } from './audio.types';

const TTS_ENDPOINT = 'https://api.openai.com/v1/audio/speech';
const TTS_MODEL = 'gpt-4o-mini-tts';
const TTS_VOICE = 'alloy';

@Injectable()
export class AudioService {
  private readonly logger = new Logger(AudioService.name);

  constructor(private readonly configService: ConfigService) {}

  async synthesize(text: string): Promise<SpeechAudioResult> {
    const apiKey = this.configService.get<string>('TTS_API_KEY')?.trim();
    if (!apiKey) {
      throw new ServiceUnavailableException(
        'Configure TTS_API_KEY to use text-to-speech',
      );
    }

    let response: Response;
    try {
      response = await fetch(TTS_ENDPOINT, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: TTS_MODEL,
          voice: TTS_VOICE,
          input: text,
          instructions:
            'Speak clearly and naturally in Bolivian Quechua. Do not translate or add words.',
          response_format: 'mp3',
        }),
        signal: AbortSignal.timeout(30_000),
      });
    } catch (error) {
      this.logger.error(
        'Could not reach the configured TTS provider',
        error instanceof Error ? error.stack : undefined,
      );
      throw new BadGatewayException('The TTS provider request failed');
    }

    if (!response.ok) {
      this.logger.error(`TTS provider returned HTTP ${response.status}`);
      throw new BadGatewayException('The TTS provider request failed');
    }

    const contentType = response.headers
      .get('content-type')
      ?.split(';', 1)[0]
      .trim()
      .toLowerCase();
    if (contentType !== 'audio/mpeg') {
      throw invalidAudioResponse();
    }

    let audio: ArrayBuffer;
    try {
      audio = await response.arrayBuffer();
    } catch (error) {
      this.logger.error(
        'TTS provider returned an unreadable audio response',
        error instanceof Error ? error.stack : undefined,
      );
      throw invalidAudioResponse();
    }

    if (audio.byteLength === 0) {
      throw invalidAudioResponse();
    }

    return {
      audioBase64: Buffer.from(audio).toString('base64'),
      mimeType: 'audio/mpeg',
    };
  }
}

function invalidAudioResponse(): BadGatewayException {
  return new BadGatewayException(
    'The TTS provider returned an invalid audio response',
  );
}
