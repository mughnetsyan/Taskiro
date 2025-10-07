import { Column } from "modules/column/column.model";
import { Project } from "modules/project/project.model";
import { BelongsTo, Column as Col, DataType, ForeignKey, Model, Table } from "sequelize-typescript";




@Table({tableName: 'tasks'})
export class Task extends Model<Task, unknown> {

    @Col({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number

    @ForeignKey(() => Column)
    columnId: number

    @ForeignKey(() => Project)
    projectId: number

    @Col({type: DataType.STRING, allowNull: false})
    text: string

    @Col({type: DataType.BOOLEAN, defaultValue: false})
    completed: boolean

    @BelongsTo(() => Column, 'columnId')
    column: Column

    @BelongsTo(() => Project, 'projectId')
    project: Project
}