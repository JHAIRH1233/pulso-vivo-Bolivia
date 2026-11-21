import {
  ExecutionContext,
  ServiceUnavailableException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { InstitutionApiKeyGuard } from './institution-api-key.guard';

describe('InstitutionApiKeyGuard', () => {
  const settings: Record<string, string> = {
    INSTITUTION_API_KEY: 'test-institution-key',
  };
  const configService = {
    get: jest.fn((name: string) => settings[name]),
  };
  let guard: InstitutionApiKeyGuard;

  beforeEach(async () => {
    settings.INSTITUTION_API_KEY = 'test-institution-key';
    const module = await Test.createTestingModule({
      providers: [
        InstitutionApiKeyGuard,
        { provide: ConfigService, useValue: configService },
      ],
    }).compile();

    guard = module.get(InstitutionApiKeyGuard);
  });

  it('allows the configured institution key', () => {
    expect(
      guard.canActivate(createContext('test-institution-key')),
    ).toBe(true);
  });

  it('rejects missing and invalid credentials', () => {
    expect(() => guard.canActivate(createContext(undefined))).toThrow(
      UnauthorizedException,
    );
    expect(() => guard.canActivate(createContext('wrong-key'))).toThrow(
      UnauthorizedException,
    );
  });

  it('reports missing server-side configuration', () => {
    settings.INSTITUTION_API_KEY = '';

    expect(() =>
      guard.canActivate(createContext('test-institution-key')),
    ).toThrow(ServiceUnavailableException);
  });
});

function createContext(apiKey: string | undefined): ExecutionContext {
  const request = {
    headers: apiKey ? { 'x-institution-api-key': apiKey } : {},
  };

  return {
    getClass: jest.fn(),
    getHandler: jest.fn(),
    getArgs: jest.fn(),
    getArgByIndex: jest.fn(),
    switchToHttp: jest.fn().mockReturnValue({
      getRequest: () => request,
      getResponse: jest.fn(),
      getNext: jest.fn(),
    }),
    switchToRpc: jest.fn(),
    switchToWs: jest.fn(),
    getType: jest.fn().mockReturnValue('http'),
  };
}
