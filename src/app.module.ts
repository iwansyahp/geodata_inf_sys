import { Module } from '@nestjs/common';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './modules/auth/auth.guard';
import { GeodataModule } from './modules/geodata/geodata.module';
import { CommonModule } from './common/common.module';
@Module({
  imports: [CommonModule, AuthModule, UsersModule, GeodataModule],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
