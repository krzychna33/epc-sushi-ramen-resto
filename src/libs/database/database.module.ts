import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigType } from '@nestjs/config';
import { CommonConfig } from '@config/common.config';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: (config: ConfigType<typeof CommonConfig>) => {
        return { uri: config.dbUrl };
      },
      inject: [CommonConfig.KEY],
    }),
  ],
})
export class DatabaseModule {}
