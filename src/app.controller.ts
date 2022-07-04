import { Controller, Get, HttpStatus } from '@nestjs/common';
import { BusinessException } from './business.exception';

@Controller()
export class AppController {
  @Get()
  getHello(): string {
    const userId = 1;
    throw new BusinessException(
      'users',
      `User with id=${userId} was not found.`,
      'User not found',
      HttpStatus.NOT_FOUND,
    );
  }
}
