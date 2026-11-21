import {
  BadGatewayException,
  Injectable,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class LlmClient {
  private readonly logger = new Logger(LlmClient.name);

  constructor(private readonly configService: ConfigService) {}

  async completeJson(systemPrompt: string, userPrompt: string): Promise<string> {
    const apiKey = this.getRequiredSetting('LLM_API_KEY');
    const model = this.getRequiredSetting('LLM_MODEL');
    const endpoint = this.getEndpoint();

    let response: Response;
    try {
      response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
          ],
          response_format: { type: 'json_object' },
          temperature: 0,
        }),
        signal: AbortSignal.timeout(30_000),
      });
    } catch (error) {
      this.logger.error(
        'Could not reach the configured LLM provider',
        error instanceof Error ? error.stack : undefined,
      );
      throw new BadGatewayException('The LLM provider request failed');
    }

    if (!response.ok) {
      this.logger.error(`LLM provider returned HTTP ${response.status}`);
      throw new BadGatewayException('The LLM provider request failed');
    }

    let payload: unknown;
    try {
      payload = await response.json();
    } catch (error) {
      this.logger.error(
        'LLM provider returned an invalid response body',
        error instanceof Error ? error.stack : undefined,
      );
      throw new BadGatewayException('The LLM provider returned an invalid response');
    }

    return this.getMessageContent(payload);
  }

  private getRequiredSetting(name: string): string {
    const value = this.configService.get<string>(name)?.trim();
    if (!value) {
      throw new ServiceUnavailableException(
        `Configure ${name} to use the LLM provider`,
      );
    }
    return value;
  }

  private getEndpoint(): string {
    const baseUrl = this.getRequiredSetting('LLM_BASE_URL');

    let url: URL;
    try {
      url = new URL(baseUrl);
    } catch {
      throw new ServiceUnavailableException(
        'LLM_BASE_URL must be a valid HTTP or HTTPS URL',
      );
    }

    if (url.protocol !== 'http:' && url.protocol !== 'https:') {
      throw new ServiceUnavailableException(
        'LLM_BASE_URL must use HTTP or HTTPS',
      );
    }

    url.pathname = `${url.pathname.replace(/\/+$/, '')}/`;
    return new URL('chat/completions', url).toString();
  }

  private getMessageContent(payload: unknown): string {
    if (!isRecord(payload) || !Array.isArray(payload['choices'])) {
      throw new BadGatewayException('The LLM provider returned an invalid response');
    }

    const firstChoice: unknown = payload['choices'][0];
    if (!isRecord(firstChoice) || !isRecord(firstChoice['message'])) {
      throw new BadGatewayException('The LLM provider returned an invalid response');
    }

    const content = firstChoice['message']['content'];
    if (typeof content !== 'string') {
      throw new BadGatewayException('The LLM provider returned an invalid response');
    }

    return content;
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
