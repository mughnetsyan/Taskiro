import { cx } from 'class-variance-authority'
import * as Popover from '@radix-ui/react-popover'


import styles from './column.module.css'

import moreActionsImg from '../assets/more-actions.svg'
import { DetailedHTMLProps, forwardRef, HTMLAttributes } from 'react'


interface Props extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
    name: string,

    deleteColumnSlot?: React.ReactNode,
    createTaskSlot?: React.ReactNode,
    dragColumnSlot?: React.ReactNode,
}

type Ref = HTMLDivElement

export const Column = forwardRef<Ref, Props>(({name, className, children, deleteColumnSlot, createTaskSlot, dragColumnSlot, ...props}, ref) => {
    return (
        <div className={cx(styles.column, className)} ref={ref} {...props}>
            <div className={styles.header}>
                <div className={styles.meta}>
                    <h2 className={styles.name}>{name}</h2>
                </div>

                <div className={styles.details}>
                    {dragColumnSlot}
                    <Popover.Root>
                        <Popover.Trigger className={styles.moreActionsTrigger}>
                            <img src={moreActionsImg} alt="More actions"/>
                        </Popover.Trigger>
                        <Popover.Portal>
                            <Popover.Content className={styles.popoverContent} align="end">
                                <Popover.Arrow className={styles.arrow}/>

                                <div className={styles.moreActions}>
                                    {deleteColumnSlot}
                                </div>
                            </Popover.Content>
                        </Popover.Portal>
                    </Popover.Root>     
                </div>
            </div>


            <div className={styles.content}>
                <div className={styles.tasks}>
                    {children}
                </div>
                {createTaskSlot}
            </div>
        </div>
    )
})