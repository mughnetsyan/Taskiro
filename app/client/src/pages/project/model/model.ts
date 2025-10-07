import { combine, createEvent, createStore, sample } from "effector";
import { applyBarrier } from "@farfetched/core";
import { invoke } from "@withease/factories";
import { debounce, debug, delay, spread } from "patronum";
import { DragEndEvent, DragOverEvent, DragStartEvent } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";

import { createColumnFactory } from "features/create-column";
import { createTaskFactory } from "features/create-task";
import { deleteColumnFactory } from "features/delete-column";
import { deleteTaskFactory } from "features/delete-task";
import { toggleTaskFactory } from "features/toggle-task";

import { authBarrier } from "entities/session";
import { createProjectQuery } from "entities/project";
import { createColumnsQuery } from "entities/column";

import { Column, Task } from "shared/api";
import { baseRoutes } from "shared/routing";

import { mockColumns, mockTasks } from "./mock";
import { parseTaskId } from "../lib";


export const $$createTaskModel = invoke(createTaskFactory)
export const $$deleteTaskModel = invoke(deleteTaskFactory)
export const $$toggleTaskModel = invoke(toggleTaskFactory)

export const $$deleteColumnModel = invoke(deleteColumnFactory)
export const $$createColumnModel = invoke(createColumnFactory)

export const projectQuery = invoke(createProjectQuery)
export const columnsQuery = invoke(createColumnsQuery)

export const dragStarted = createEvent<DragStartEvent>()
export const dragEnded = createEvent<DragEndEvent>()
export const dragging = createEvent<DragOverEvent>()

export const $columns = createStore(mockColumns.sort((a, b) => a.order - b.order))
export const $tasks = createStore(mockTasks.sort((a, b) => a.order - b.order))

export const $activeColumn = createStore<Column | null>(null)
export const $activeTask = createStore<Task | null>(null)

export const $columnsId = combine($columns, (columns) => columns.map((column) => column.id))

export const $name = createStore<string>('')

applyBarrier([projectQuery, columnsQuery],  { barrier: authBarrier })

sample({
    clock: projectQuery.$data,
    filter: Boolean,
    target: spread({
        name: $name,
    })
})

// sample({
//     clock: columnsQuery.$data,
//     filter: Boolean,
//     target: $columns
// })

sample({
    clock: [
        $$createTaskModel.createNewTaskMutation.finished.success, 
        $$createColumnModel.createNewColumnMutation.finished.success,
        $$deleteTaskModel.deleteTaskMutation.finished.success,
        $$deleteColumnModel.deleteColumnMutation.finished.success,
        $$toggleTaskModel.toggleTaskMutation.finished.success
    ],
    source: baseRoutes.projects.project.$params,
    fn: ({id}) => ({projectId: id}),
    target: columnsQuery.start
})


sample({
    clock: dragStarted,
    filter: (event) => 
        Boolean(event.active.data.current) && 
        event.active.data.current?.type === 'column',
    fn: (event) => event.active.data.current?.data as Column | null, 
    target: $activeColumn
})

sample({
    clock: dragStarted,
    filter: (event) => 
        Boolean(event.active.data.current) && 
        event.active.data.current?.type === 'task',
    fn: (event) => event.active.data.current?.data as Task | null, 
    target: $activeTask
})



sample({
    clock: dragEnded,
    source: $columns,
    filter: (_, event) => 
        Boolean(event.over) && 
        (event.active.id !== event.over?.id) && 
        (event.active.data.current?.type === 'column'),
    fn: (columns, event) => {
        const { active, over } = event

        const activeColumnIndex = columns.findIndex((column) => column.id === active.id)

        const overColumnIndex = columns.findIndex((column) => column.id === over?.id)

        return arrayMove(columns, activeColumnIndex, overColumnIndex)
    },
    target: $columns
})

sample({
    clock: dragEnded,
    fn: () => null,
    target: [
        $activeColumn, 
        $activeTask
    ]
})



sample({
    clock: dragging,
    source: {
        tasks: $tasks,
        columns: $columns
    },
    filter: (_, event) => Boolean(event.over) && (event.active.id !== event.over?.id) && (event.active.data.current?.type === 'task'),
    fn: ({tasks, columns}, event) => {
        const { active, over } = event
        
        const activeTaskIndex = tasks.findIndex((task) => parseTaskId(task.id) === active.id)

        switch(over?.data.current?.type) {
            case 'task':
                const overTaskIndex = tasks.findIndex((task) => parseTaskId(task.id) === over.id)

                if (tasks[activeTaskIndex].columnId != tasks[overTaskIndex].columnId) {
                    tasks[activeTaskIndex].columnId = tasks[overTaskIndex].columnId

                    return arrayMove(tasks, activeTaskIndex, overTaskIndex - 1)
                }

                return arrayMove(tasks, activeTaskIndex, overTaskIndex)
            case 'column':
                const overColumnIndex = columns.findIndex((column) => column.id === over.id)
                const lastTaskIndex = tasks.findLastIndex((task) => task.columnId === over.id)

                if(tasks[activeTaskIndex].columnId !== columns[overColumnIndex].id) {
                    tasks[activeTaskIndex].columnId = columns[overColumnIndex].id
                }
                return arrayMove(tasks, activeTaskIndex, lastTaskIndex + 1)
            default:
                return arrayMove(tasks, activeTaskIndex, activeTaskIndex)
        }
    },
    target: $tasks
})

export const $isSliderActive = createStore(true)

sample({
    clock: dragStarted,
    fn: () => false,
    target: $isSliderActive
})

// TODO: somehow detect when transition is ended
sample({
    clock: delay(dragEnded, 250),
    fn: () => true,
    target: $isSliderActive
})