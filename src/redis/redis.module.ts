import { Module } from '@nestjs/common';
import { REDIS_CLIENT } from './redis.constants';
import * as Redis from 'redis';
import { ConfigService } from '@nestjs/config';

@Module({
  providers: [
    {
      provide: REDIS_CLIENT,
      useFactory: (configService: ConfigService) =>
        Redis.createClient({
          url: 'rediss://default:AVNS_75aohp0WVCxVPunShux@db-redis-nyc1-77005-do-user-10877346-0.b.db.ondigitalocean.com:25061',
        }),
      inject: [ConfigService],
    },
  ],
  exports: [REDIS_CLIENT],
})
export class RedisModule {}
