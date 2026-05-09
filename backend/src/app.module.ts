import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule } from '@nestjs/throttler';
import appConfig from './config/app.config';
import databaseConfig from './config/database.config';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { PatientsModule } from './modules/patients/patients.module';
import { AppointmentsModule } from './modules/appointments/appointments.module';

@Module({
  imports: [
    // Config — global, loads .env
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, databaseConfig],
      envFilePath: '.env',
    }),

    // Rate limiting — 100 requests per 60 seconds
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 100 }]),

    // Database
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get('database.host'),
        port: config.get('database.port'),
        database: config.get('database.name'),
        username: config.get('database.user'),
        password: config.get('database.password'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: config.get('app.nodeEnv') !== 'production',
        logging: config.get('app.nodeEnv') === 'development',
      }),
    }),

    UsersModule,
    AuthModule,
    PatientsModule,
    AppointmentsModule,
  ],
})
export class AppModule {}