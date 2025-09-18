import {
  Injectable,
  PipeTransform,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';

/**
 * Simple ParseIntPipe-like example that validates and transforms
 * numeric route params to number type. Keeps behavior explicit for teaching.
 */
@Injectable()
export class ParseIntPipe implements PipeTransform<string, number> {
  transform(value: string, metadata: ArgumentMetadata): number {
    const val = parseInt(value, 10);
    if (isNaN(val)) {
      throw new BadRequestException(`Validation failed (${metadata.data} is not an integer)`);
    }
    return val;
  }
}
