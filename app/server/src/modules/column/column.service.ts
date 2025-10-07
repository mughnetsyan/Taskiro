import { forwardRef, Inject, Injectable } from '@nestjs/common';

import { InjectModel } from '@nestjs/sequelize';

import { Column } from './column.model';
import { GetColumnsDto, CreateColumnDto, DeleteColumnDto } from './dto';
import { Task } from 'modules/task/task.model';


@Injectable()
export class ColumnService {
    constructor (
        @InjectModel(Column) private columnRepository: typeof Column,
    ) {}

    async getColumns(dto: GetColumnsDto) {
        const { projectId } = dto

        const columns = await this.columnRepository.findAll({
            where: {
                projectId
            },
            // include: {
            //     model: Task,
            //     as: 'tasks'
            // },
            // order: [
            //     ['id', 'ASC'],
            //     [{model: Task, as: 'tasks'}, 'id', 'ASC']
            // ]
        })
        
        return columns
    }

    async createColumn(dto: CreateColumnDto) {
        const column = await this.columnRepository.create(dto)

        return column
    }

    async deleteColumn(dto: DeleteColumnDto) {
        const { id } = dto

        const column = await this.columnRepository.destroy({
            where: {
                id
            }
        })

        return column
    }
}
