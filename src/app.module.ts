import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { UserController } from './users/user.controller';
import { UserService } from './users/user.service';
import { User } from './users/user.entity';
import { PostModule } from './posts/post.module';
import { PostController } from './posts/post.controller';
import { AppController } from './app.controller';

@Module({
  imports: [
    // global config module - load .env
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // TypeORM config
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('DB_HOST') || 'localhost',
        port: parseInt(configService.get<string>('DB_PORT') || '3306', 10),
        username: configService.get<string>('DB_USER') || 'root',
        password: configService.get<string>('DB_PASS') || '',
        database: configService.get<string>('DB_NAME') || 'intern_task',
        autoLoadEntities: true,
        synchronize: true,
      }),
      inject: [ConfigService],
    }),

    TypeOrmModule.forFeature([User]),

    // JWT config
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET') || 'default_secret',
        signOptions: {
          expiresIn:
            (configService.get<string>('JWT_EXPIRES_IN') as any) || '1d',
        },
      }),
      inject: [ConfigService],
    }),

    PostModule,
  ],
  controllers: [UserController, PostController, AppController],
  providers: [UserService],
  exports: [JwtModule],
})
export class AppModule {}
