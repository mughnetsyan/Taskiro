import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { SequelizeModule } from '@nestjs/sequelize'
import { JwtModule } from '@nestjs/jwt'
import { User } from 'modules/user/user.model'
import { Project } from 'modules/project/project.model'
import { Column } from 'modules/column/column.model'
import { Task } from 'modules/task/task.model'
import { UserModule } from 'modules/user/user.module'
import { ProjectModule } from 'modules/project/project.module'
import { SessionModule } from 'modules/session/session.module'
import { TaskModule } from 'modules/task/task.module'
import { ColumnModule } from 'modules/column/column.module'
import { SessionMiddleware } from 'modules/session/session.middleware'
import { DragAndDropModule } from 'modules/drag-and-drop/drag-and-drop.module'





@Module({
  controllers: [],
  providers: [],
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`
    }),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: parseInt(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USERNAME,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DATABASE,
      models: [User, Project, Column, Task],
      autoLoadModels: true
    }),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET
    }),


    UserModule,
    ProjectModule,
    SessionModule,
    TaskModule,
    ColumnModule,
    DragAndDropModule
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(SessionMiddleware)
      .exclude(
        'session/refresh',
        'session/sign-in',
        'session/sign-up'
      )
      .forRoutes('*')
  }
}
