import { HttpStatus } from '@nestjs/common';

export type ErrorDomain = 'users' | 'orders' | 'generic';

export class BusinessException extends Error {
  public readonly id: string;
  public readonly timestamp: Date;

  constructor(
    public readonly domain: ErrorDomain,
    public readonly message: string,
    public readonly apiMessage: string,
    public readonly status: HttpStatus,
  ) {
    super(message);
    this.id = BusinessException.genId();
    this.timestamp = new Date();
  }

  // See: https://stackoverflow.com/a/44678459/5091346
  private static genId(length = 16): string {
    const p = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    return [...Array(length)].reduce(
      (a) => a + p[~~(Math.random() * p.length)],
      '',
    );
  }
}
