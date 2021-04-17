import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class ExplodeQueryPipe implements PipeTransform {
  transform(value: string) {
    if (!value) {
      return value;
    }

    if (typeof value !== 'string' || !value.match(/^[0-9]+(\,[0-9]+)*$/g)) {
      throw new BadRequestException('Validation failed');
    }

    return value.split(',').map(v => +v);
  }
}
