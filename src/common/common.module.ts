import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { configModuleOptions } from './configs/module-options';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from 'src/modules/users/models/user.model';

@Module({
  imports: [
    ConfigModule.forRoot(configModuleOptions),
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        dialect: 'postgres',
        host: configService.get<string>('database.host'),
        port: configService.get<number>('database.port'),
        database: configService.get<string>('database.name'),
        username: configService.get<string>('database.user'),
        password: configService.get<string>('database.pass'),
        models: [User],
        debug: configService.get<string>('env') === 'development',
      }),
    }),
  ],
  exports: [ConfigModule],
  providers: [],
})
export class CommonModule {}
