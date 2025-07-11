import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { ProfileModule } from './profile/profile.module';
import { PostModule } from './post/post.module';
import { CloudModule } from './cloud/cloud.module';
import { UserModule } from './user/user.module';
import { PostCategoryModule } from './admin/post-category/post-category.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // penting supaya bisa digunakan di semua module
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('DB_HOST'),
        port: parseInt(configService.get<string>('DB_PORT') ?? '3306'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    // User Module 
    AuthModule,
    ProfileModule,
    UserModule,
    PostModule,
    CloudModule,

    // Admin Module 
    PostCategoryModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
