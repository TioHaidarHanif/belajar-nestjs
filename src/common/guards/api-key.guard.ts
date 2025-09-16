import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { ApiKeyService } from './api-key.service';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(private readonly apiKeyService: ApiKeyService) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest();
    const key = req.headers['x-api-key'] || req.headers['X-API-KEY'];
    const k = Array.isArray(key) ? key[0] : key;
    if (!this.apiKeyService.validate(k)) {
      throw new UnauthorizedException('Missing or invalid API key');
    }
    return true;
  }
}

export default ApiKeyGuard;
