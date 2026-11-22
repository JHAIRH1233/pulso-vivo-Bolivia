import { timingSafeEqual } from 'node:crypto';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ServiceUnavailableException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

@Injectable()
export class InstitutionApiKeyGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const expectedKey = this.configService
      .get<string>('INSTITUTION_API_KEY')
      ?.trim();
    if (!expectedKey) {
      throw new ServiceUnavailableException(
        'Configure INSTITUTION_API_KEY to use institutional endpoints',
      );
    }

    const request = context.switchToHttp().getRequest<Request>();
    const providedKey = request.headers['x-institution-api-key'];
    if (
      typeof providedKey !== 'string' ||
      !matchesApiKey(providedKey, expectedKey)
    ) {
      throw new UnauthorizedException('Invalid institutional API key');
    }

    return true;
  }
}

function matchesApiKey(providedKey: string, expectedKey: string): boolean {
  const provided = Buffer.from(providedKey);
  const expected = Buffer.from(expectedKey);
  return (
    provided.length === expected.length && timingSafeEqual(provided, expected)
  );
}
