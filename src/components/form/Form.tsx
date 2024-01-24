import React, { ChangeEvent, useState } from "react";
import s from "./Form.module.css"
import {useAppDispatch, useAppSelector} from '../../app/store'
import { createTaskTC } from "../../features/TodolistsList/boards-reducer";
import { BoardsType } from "../boards/Boards";
import { todolistsAPI } from "../../api/todolists-api";

type FormType = {
    setFormActive: () => void,
}

export const Form: React.FC<FormType> = ({setFormActive}) => {

    const boards = useAppSelector<BoardsType[]>(state => state.boards)
    const boardId = boards["0"]._id
    const dispatch = useAppDispatch()

    const [title, setTitle] = useState<string>("")
    const [description, setDescription] = useState<string>("")

    const onChangeTitleHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setTitle(e.currentTarget.value)
    }

    const onChangeDescriptionHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setDescription(e.currentTarget.value)
    }

    const onSubmit = () => {
        setFormActive()
        const order = boards["0"].todoSubBoard.length
        const thunk = createTaskTC(title, description, 'todoSubBoard', boardId, order)
        dispatch(thunk)
    }

    return (
        <div className={s.formContainer}>
            <label htmlFor="">Task Info</label>
                <input type="text" placeholder="Please, enter a task title" onChange={onChangeTitleHandler}/>
                <input type="text" placeholder="Please, enter a task description" onChange={onChangeDescriptionHandler}/>
            <button onClick={onSubmit}>Submit</button>
        </div>
    )
}