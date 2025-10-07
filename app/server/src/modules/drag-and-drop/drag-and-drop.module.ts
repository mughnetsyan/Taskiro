import { Module } from '@nestjs/common';
import { DragAndDropService } from './drag-and-drop.service';
import { DragAndDropController } from './drag-and-drop.controller';

import { ColumnModule } from 'modules/column/column.module';
import { TaskModule } from 'modules/task/task.module';

@Module({
  controllers: [DragAndDropController],
  providers: [DragAndDropService],  
  imports: [
    ColumnModule,
    TaskModule
  ],
})
export class DragAndDropModule {}
