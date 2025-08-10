import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';

@Injectable()
export class RequestLoggerMiddleware implements NestInterceptor {
  private readonly logger = new Logger();

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();

    const now = Date.now();
    return next
      .handle()
      .pipe(
        tap(() =>
          this.logger.debug(
            `${request.method} ${request.url} - Handled in ${Date.now() - now}ms`,
          ),
        ),
      );
  }
}
