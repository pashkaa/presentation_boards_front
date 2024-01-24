import React, { ChangeEvent, useEffect, useState } from "react";
import s from "./SearchBar.module.css"
import {useAppDispatch, useAppSelector} from '../../app/store'
import { createBoardTC, deleteTasksTC, fetchTodolistsTC } from "../../features/TodolistsList/boards-reducer";
import { BoardsType } from "../boards/Boards";
import { todolistsAPI } from "../../api/todolists-api";

export const SearchBar = () => {
    const boards = useAppSelector<BoardsType[]>(state => state.boards)
    const [error, setError] = useState<string>('')
    const [input, setInput] = useState("")
    const [allGood, setAllGood] = useState(true)

    const dispatch = useAppDispatch()

    function isValidHex(str: string) {
        const hexPattern = /^[0-9a-fA-F]{24}$/;
      
        return hexPattern.test(str);
      }

    const loadBoard = () => {

        if (!isValidHex(input)) {
            setError("Board ID must be a 24-character hex string")
        } else {
            todolistsAPI.getBoardById(input)
                .then((res) => {
                    if ( res.data.length > 0 ) {
                        setError('')
                        setAllGood(false)
                        const thunk = fetchTodolistsTC(input)
                        dispatch(thunk)
                    } else {
                        setError("Board with such id doesn't exist")
                    }
                })
        }
    }

    const deleteBoard = () => {
        const thunk = deleteTasksTC(input)
        dispatch(thunk)
        setAllGood(true)
        setInput('')
        setError('')
    }

    const createBoard = () => {
        const thunk = createBoardTC()
        dispatch(thunk)
        setAllGood(false)
        setError('')
        setTimeout(() => {
            const boardId: string = localStorage.getItem('boardId') || '';
            setInput(boardId)
        }, 1000)
    }

    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setInput(e.currentTarget.value)
    }

    return (
        <div>
            <div className={s.searchBar}>
                <input className={s.searchBar_input} value={input} type="text" placeholder="Enter a board ID here..." onChange={onChangeHandler}/>
                <div className={s.searchBar__buttons}>
                    { allGood 
                        ? 
                            <div className={s.searchBar__buttons}>
                                <button className={s.searchBar_button} onClick={loadBoard}>Load</button>
                                <button className={s.searchBar_button} onClick={createBoard}>Create</button> 
                            </div>
                            
                        :  
                            <div className={s.searchBar__buttons}>
                                <button className={s.searchBar_button} onClick={loadBoard}>Load</button>
                                <button className={s.searchBar_button} onClick={deleteBoard}>Delete</button> 
                            </div>
                    }
                </div>
            </div>
            {
                error ? <div className={s.error}>
                {error}
            </div> : <></>
            }
        </div>
    )
}