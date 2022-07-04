import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { CustomExceptionFilter } from '../src/exception.filter';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalFilters(new CustomExceptionFilter());
    await app.init();
  });

  it('Should return 404 error on GET /', () => {
    return request(app.getHttpServer()).get('/').expect(HttpStatus.NOT_FOUND);
  });

  it('Should return 404 error on GET /random', () => {
    return request(app.getHttpServer())
      .get('/random')
      .expect(HttpStatus.NOT_FOUND);
  });
});
