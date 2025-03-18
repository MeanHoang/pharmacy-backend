import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import databaseConfig from './config/database.config';

import { AdminAuthModule } from './modules/auth/admin-auth/admin-auth.module';
import { AdminModule } from './modules/admin/admin.module';
import { CustomerModule } from './modules/customer/customer.module';
import { CustomerAuthModule } from './modules/auth/customer-auth/customer-auth.module';
import { CustomerAddressModule } from './modules/customer-address/customer-address.module';

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
        entities: [__dirname + '/**/*.entity.{ts,js}'],
        synchronize: false,
        // logging: true, //check log querry to sql
      }),
      inject: [ConfigService],
    }),
    AdminAuthModule,
    AdminModule,
    CustomerModule,
    CustomerAuthModule,
    CustomerAddressModule,
  ],
})
export class AppModule {}
