import { useUnit } from 'effector-react'
import { DndContext, DragOverlay, MouseSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core'
import { SortableContext } from '@dnd-kit/sortable'

import { BaseLayout } from 'widgets/layouts'

import { CreateTask } from 'features/create-task'
import { CreateNewColumn } from 'features/create-column'
import { DeleteColumn } from 'features/delete-column'
import { DeleteTask } from 'features/delete-task'
import { ToggleTask } from 'features/toggle-task'

import { $columns, $name, $$createColumnModel, $$deleteColumnModel, $$createTaskModel, $$deleteTaskModel, $$toggleTaskModel, $columnsId, $activeColumn, $activeTask, dragStarted, dragEnded, dragging, $tasks } from '../model'

import { Slider } from './slider'

import { SortableColumn, SortableTask } from './dnd'

import { parseId, parseTaskId } from '../lib'

import styles from './project.module.css'

import { cx } from 'class-variance-authority'
import { createPortal } from 'react-dom'


export const Project = () => {
    const name = useUnit($name)

    const tasks = useUnit($tasks)

    const columns = useUnit($columns)
    const columnsId = useUnit($columnsId)

    const activeColumn = useUnit($activeColumn)
    const activeTask = useUnit($activeTask)

    const dragStartHandler = useUnit(dragStarted)
    const dragEndHandler = useUnit(dragEnded)
    const dragOverHandler = useUnit(dragging)

    const mouseSensor = useSensor(MouseSensor, {
        activationConstraint: {
            delay: 100,
            tolerance: 5
        }
    })

    const touchSensor = useSensor(TouchSensor)

    const sensors = useSensors(mouseSensor, touchSensor)

    return (
        <BaseLayout title={name}>
            <Slider>
                <DndContext
                    onDragStart={dragStartHandler} 
                    onDragEnd={dragEndHandler}
                    onDragOver={dragOverHandler}

                    sensors={sensors}
                >
                    <SortableContext items={columnsId}>
                            {columns.map(({id: columnId, name}) => (
                                <SortableColumn
                                    id={columnId}
                                    key={columnId}
                                    name={name}

                                    tasksId={tasks.filter((task) => task.columnId === columnId).map((task) => parseTaskId(task.id))}

                                    className={styles.column}

                                    createTaskSlot={<CreateTask model={$$createTaskModel} columnId={columnId}/>}
                                    deleteColumnSlot={<DeleteColumn model={$$deleteColumnModel} id={columnId}/>}
                                >
                                    {tasks
                                        .filter((task) => task.columnId === columnId)
                                        .map(({id, text, completed}) => {
                                            return (
                                                <SortableTask 
                                                    id={parseTaskId(id)}
                                                    key={parseTaskId(id)} 
                                                    text={text} 
                                                    completed={completed} 
                                                    columnId={columnId}
                    
                                                    deleteTaskSlot={<DeleteTask model={$$deleteTaskModel} id={id}/>}
                                                    toggleTaskSlot={<ToggleTask model={$$toggleTaskModel} id={id} completed={completed}/>}
                                                />
                                            )
                                        })
                                    }
                                </SortableColumn>
                            ))}
                    </SortableContext>
                    {createPortal(
                        <DragOverlay>
                        {activeColumn &&  
                                (<SortableColumn
                                    id={activeColumn.id}
                                    key={activeColumn.id}
                                    name={activeColumn.name}

                                    tasksId={tasks.filter((task) => task.columnId === activeColumn.id).map((task) => parseTaskId(task.id))}

                                    className={styles.column}

                                    createTaskSlot={<CreateTask model={$$createTaskModel} columnId={activeColumn.id}/>}
                                    deleteColumnSlot={<DeleteColumn model={$$deleteColumnModel} id={activeColumn.id}/>}
                                >
                                    {tasks
                                        .filter((task) => task.columnId === activeColumn.id)
                                        .map(({id, text, completed}) => {
                                            return (
                                                <SortableTask
                                                    id={parseTaskId(id)}
                                                    key={parseTaskId(id)} 
                                                    text={text} 
                                                    completed={completed} 
                                                    columnId={activeColumn.id}
                    
                                                    deleteTaskSlot={<DeleteTask model={$$deleteTaskModel} id={id}/>}
                                                    toggleTaskSlot={<ToggleTask model={$$toggleTaskModel} id={id} completed={completed}/>}
                                                />
                                            )
                                        })
                                    }
                                </SortableColumn>)
                            }
                            {activeTask && (
                                <SortableTask
                                    id={parseTaskId(activeTask.id)}
                                    key={parseTaskId(activeTask.id)} 
                                    text={activeTask.text} 
                                    completed={activeTask.completed} 
                                    columnId={activeTask.columnId}

                                    deleteTaskSlot={<DeleteTask model={$$deleteTaskModel} id={activeTask.id}/>}
                                    toggleTaskSlot={<ToggleTask model={$$toggleTaskModel} id={activeTask.id} completed={activeTask.completed}/>}
                                />
                            )}
                        </DragOverlay>,
                        document.body
                    )}
                    
                </DndContext>
                <div className={styles.createNewColumnContainer}>
                    <CreateNewColumn model={$$createColumnModel}/>
                </div>
            </Slider>
        </BaseLayout>
    )
}