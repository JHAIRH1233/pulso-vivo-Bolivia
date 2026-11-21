import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getStatus() {
    return {
      name: 'PULSO VIVO Bolivia',
      status: 'ok',
    };
  }
}
