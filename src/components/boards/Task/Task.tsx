import React, { ChangeEvent, KeyboardEvent, useState } from "react"
import s from "./Task.module.css"
import { TaskType } from "../board/Board"
import { Buttons } from "./Buttons/Buttons"
import {useAppDispatch, useAppSelector} from '../../../app/store'
import { updateTaskTC } from "../../../features/TodolistsList/boards-reducer";
import {useDraggable} from '@dnd-kit/core';

type TaskBodyType = TaskType & {
    droppableId: string
    order: number
}

export const Task: React.FC<TaskBodyType> = ({_id, title, description, boardId, droppableId, order}) => {
    const [isReady, setIsReady] = useState<boolean>(true)
    const [myTitle, setMyTitle] = useState(title)
    const [myDescription, setMyDescription] = useState(description)

    const dispatch = useAppDispatch()

    const changeIsGood = () => {
        setIsReady(prev => !prev)
    }

    const changeMyTitleHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setMyTitle(e.currentTarget.value)
    }

    const changeMyDescriptionHandler = (e: ChangeEvent<HTMLTextAreaElement>) => {
        setMyDescription(e.currentTarget.value)
    }

    const onKeyDownHandler = (event: KeyboardEvent<HTMLElement>) => {
        if (event.key === "Enter"){    
            const taskId = _id;
    
            const thunk = updateTaskTC(myTitle, myDescription, taskId, boardId)
            
            dispatch(thunk)
            changeIsGood()
        }
    }

    return (
        <div className={s.taskContainer} >
            <div className={s.taskContainer__title}>
                {isReady ? myTitle : <input className={s.input} value={myTitle} onChange={changeMyTitleHandler} onKeyDown={onKeyDownHandler}></input>}
            </div>
            <div className={s.taskContainer__description}>
                {isReady ? myDescription : <textarea className={s.textArea} value={myDescription} onChange={changeMyDescriptionHandler} onKeyDown={onKeyDownHandler}></textarea>}
            </div>
            <Buttons disabled={!isReady} _id={_id} order={order} title={title} description={description} droppableId={droppableId} boardId={boardId} changeIsGood={changeIsGood}/>
        </div>
    )
}