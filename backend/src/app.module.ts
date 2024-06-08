import { Module } from '@nestjs/common';
import { TodoModule } from './todo/todo.module';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    TodoModule,
    AuthModule,
    MongooseModule.forRoot('mongodb://localhost:27017/TDC'),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
