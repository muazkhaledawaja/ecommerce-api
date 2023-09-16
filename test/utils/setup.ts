import { TestUsersModule } from './test-users/test-users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { TestUsersService } from './test-users/test-users.service';
import configuration from '../../src/config/configuration';

const setup = async () => {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [
      ConfigModule.forRoot({
        ignoreEnvFile: true,
        isGlobal: true,
        load: [configuration],
      }),
      TypeOrmModule.forRootAsync({
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => ({
          type: 'postgres',
          host: 'localhost',
          port: 5432,
          username: 'postgres',
          password: '123456789**Mm',
          database: 'E-commerce',
          entities: [],
          synchronize: true,
          autoLoadEntities: true,
          keepConnectionAlive: true,
          dropSchema: true,
        }),
        inject: [ConfigService],
      }),
      TestUsersModule,
    ],
  }).compile();

  const testUsers = moduleFixture.get<TestUsersService>(TestUsersService);
  await testUsers.init();
};

export default setup;
