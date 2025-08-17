import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';

@Injectable()
/**
 * Intercepts each request and logs the location accessed, the method used,
 * and the time taken to handle the request.
 */
export class RequestLoggerMiddleware implements NestInterceptor {
  private readonly logger = new Logger();

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();

    const now = Date.now();
    return next.handle().pipe(
      tap(() => {
        const elapsed = Date.now() - now;
        if (elapsed > 1000) {
          this.logger.error(
            `${request.method} ${request.url} - EXTREME DELAY: ${elapsed}ms`,
          );
        } else if (elapsed > 500) {
          this.logger.warn(
            `${request.method} ${request.url} - Slow response time: ${elapsed}ms`,
          );
        } else {
          this.logger.debug(
            `${request.method} ${request.url} - Handled in ${elapsed}ms`,
          );
        }
      }),
    );
  }
}
