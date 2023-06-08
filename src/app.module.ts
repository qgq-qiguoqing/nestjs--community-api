import { Module } from '@nestjs/common';
import * as path from "path";
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";
import { AuthModule } from './auth/auth.module';
import { UploadModule } from './upload/upload.module';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
console.log(__dirname);

const isProd = process.env.NODE_ENV == "production";
@Module({
  imports: [
    MulterModule.register({
      storage: diskStorage({
        // 指定文件存储目录
        destination: path.join(__dirname, '../uploads'),
        // 通过时间戳来重命名上传的文件名
        filename: (_, file, callback) => {
          const fileName = `${new Date().getTime() + path.extname(file.originalname)
            }`;
          return callback(null, fileName);
        },
      }),
    }),

    ConfigModule.forRoot({
      envFilePath: [isProd ? path.resolve(".env.prod") : path.resolve(".env")],
    }),
    TypeOrmModule.forRoot({
      type: "mysql",
      autoLoadEntities: true, //自动加载实体
      host: "localhost",
      port: 3306, // 端口号
      username: "root", // 用户名
      password: "123456", // 密码
      database: "test", //数据库名
      synchronize: !isProd, //是否自动同步实体文件,生产环境建议关闭
    }), UserModule, AuthModule, UploadModule],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule { }