import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';

/**
 * Example response transform interceptor.
 * - Wraps successful responses in a consistent envelope
 * - Can remove sensitive fields or perform mapping
 */
@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, any> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => ({ success: true, timestamp: Date.now(), data })),
    );
  }
}
