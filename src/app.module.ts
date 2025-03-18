import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { CommonConfig } from '@config/common.config';
import { RedisConfig } from '@config/redis.config';
import { OrdersModule } from '@orders/orders.module';
import { MealsModule } from '@meals/meals.module';
import { CategoriesModule } from '@categories/categories.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [CommonConfig, RedisConfig],
    }),
    BullModule.forRootAsync({
      useFactory: (config: ConfigType<typeof RedisConfig>) => ({
        connection: config,
      }),
      inject: [RedisConfig.KEY],
    }),
    OrdersModule,
    MealsModule,
    CategoriesModule,
  ],
})
export class AppModule {}
