import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import databaseConfig from './config/database.config';

import { AdminAuthModule } from './modules/auth/admin-auth/admin-auth.module';
import { AdminModule } from './modules/admin/admin.module';
import { Admin } from './entities/admin.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [databaseConfig],
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        type: 'mysql', 
        host: configService.get('database.host'),
        port: configService.get('database.port'),
        username: configService.get('database.username'),
        password: configService.get('database.password'),
        database: configService.get('database.database'),
        entities: [Admin], 
        synchronize: false,
        // logging: true, //check log querry to sql
      }),
      inject: [ConfigService],
    }),
    AdminAuthModule, 
    AdminModule
  ],
})
export class AppModule {}