import { BadRequestException, Body, Controller, Post, Query } from '@nestjs/common';

import { ColumnService } from 'modules/column/column.service';
import { TaskService } from 'modules/task/task.service';

import { DragAndDropService } from './drag-and-drop.service';

import { arrayMove } from './lib/array-move';


@Controller('drag-and-drop')
export class DragAndDropController {
  constructor(
    private readonly dragAndDropService: DragAndDropService,
    private readonly columnService: ColumnService,
    private readonly taskService: TaskService
  ) {}

  @Post('reorder-columns')
  async reorderColumns(@Body() body, @Query('projectId') projectId: string) {
    const { activeId, overId } = body

    if(activeId === undefined || overId === undefined) throw new BadRequestException()

    const proxyColumns = await this.columnService.getColumns({projectId: parseInt(projectId)})

    const columns = getActualData(proxyColumns)

    const activeIndex = columns.findIndex((column) => column.id === activeId)
    const overIndex = columns.findIndex((column) => column.id === overId)

    return redefineOrder(arrayMove(columns, activeIndex, overIndex))
  }

  @Post('reorder-tasks')
  async reorderTasks(@Body() body, @Query('projectId') projectId: string) {
    const { activeId, overId, overType } = body

    if(!activeId || !overId || !overType) throw new BadRequestException()

    const proxyTasks = await this.taskService.getTasksByProjectId({projectId: parseInt(projectId)})
    const proxyColumns = await this.columnService.getColumns({projectId: parseInt(projectId)})
    
    const tasks = getActualData(proxyTasks)
    const columns = getActualData(proxyColumns)
    
    const activeIndex = tasks.findIndex((task) => task.id === activeId)

    switch(overType) {
      case 'task':
        const overTaskIndex = tasks.findIndex((task) => task.id === overId)

        if (tasks[activeIndex].columnId != tasks[overTaskIndex].columnId) {
          tasks[activeIndex].columnId = tasks[overTaskIndex].columnId

          return redefineOrder(arrayMove(tasks, activeIndex, overTaskIndex - 1))
        }

        return redefineOrder(arrayMove(tasks, activeIndex, overTaskIndex))
      case 'column':
        const overColumnIndex = columns.findIndex((column) => column.id === overId)
        const lastTaskIndex = tasks.findLastIndex((task) => task.columnId === overId)

        if(tasks[activeIndex].columnId !== columns[overColumnIndex].id) {
            tasks[activeIndex].columnId = columns[overColumnIndex].id
        }

        return redefineOrder(arrayMove(tasks, activeIndex, lastTaskIndex))
      default:
        return redefineOrder(arrayMove(tasks, activeIndex, activeIndex))
    }
  }
}

export function getActualData<T>(data: T): T {
  return JSON.parse(JSON.stringify(data))
}

export function redefineOrder<T>(data: T[]) {
  return data.map((entity, index) => ({...entity, order: index}))
}
