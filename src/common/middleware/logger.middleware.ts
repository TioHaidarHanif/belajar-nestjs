import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { randomUUID } from 'crypto';
import RequestContext from '../request-context/request-context';

/**
 * Simple request logger middleware that also attaches a correlation id
 * to requests (X-Request-Id). This is a best-practice lightweight
 * example suitable for most applications.
 */
@Injectable()
export class LoggerMiddleware implements NestMiddleware {
	private readonly logger = new Logger('HTTP');

	use(req: Request & { id?: string }, res: Response, next: NextFunction) {
			// ensure we have a request id for cross-service tracing
			const requestId = req.headers['x-request-id'] as string | undefined;
			const id = requestId ?? randomUUID();
			req.id = id;

			// run the rest of the request inside AsyncLocalStorage so other modules
			// (eg. http-client wrapper) can read the current requestId.
			return RequestContext.run({ requestId: id }, () => {
				const { method, originalUrl } = req;
				const userAgent = req.get('user-agent') || '';
				const ip = req.ip || req.socket?.remoteAddress;

				this.logger.log(`--> [${id}] ${method} ${originalUrl} - ${userAgent} - ${ip}`);

				const start = Date.now();
				res.setHeader('X-Request-Id', id);

				res.on('finish', () => {
					const elapsed = Date.now() - start;
					this.logger.log(`<-- [${id}] ${method} ${originalUrl} ${res.statusCode} ${elapsed}ms`);
				});

				next();
			});
	}
}

export default LoggerMiddleware;
