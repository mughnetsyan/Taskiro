import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { Task } from './task.model';
import { CreateTaskDto } from './dto';
import { GetTasksByColumnId } from './dto';
import { ToggleTaskDto } from './dto';
import { DeleteTaskDto } from './dto/delete-task.dto';
import { GetTasksByProjectId } from './dto/get-tasks-by-project-id';

@Injectable()
export class TaskService {
    constructor (
        @InjectModel(Task) private taskRepository: typeof Task
    ) {}

    async createTask(dto: CreateTaskDto) {
        const defaultCompleted = false

        const task = await this.taskRepository.create({...dto, completed: defaultCompleted})

        return task
    }

    async getTasksByColumnId(dto: GetTasksByColumnId) {
        const { columnId } = dto

        const tasks = await this.taskRepository.findAll({
            where: {
                columnId
            },
            order: [
                ['id', 'ASC']
            ]
        })

        return tasks
    }

    async getTasksByProjectId(dto: GetTasksByProjectId) {
        const { projectId } = dto

        const tasks = await this.taskRepository.findAll({
            where: {
                projectId
            },
            order: [
                ['id', 'ASC']
            ]
        })

        return tasks
    }

    async toggleTask(dto: ToggleTaskDto) {
        const { id } = dto

        const task = await this.taskRepository.findByPk(id)

        task.completed = !task.completed

        task.save()

        return task
    }

    async deleteTask(dto: DeleteTaskDto) {
        const { id } = dto

        const task = await this.taskRepository.findByPk(id)

        task.destroy()

        return task
    }

    async deleteTasksByColumnId(columnId) {
        const tasks = await this.taskRepository.destroy({
            where: {
                columnId
            }
        })

        return tasks
    }
}
