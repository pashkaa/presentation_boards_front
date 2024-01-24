import React from "react";
import s from "./Boards.module.css";
import Board from "./board/Board";
import { useAppDispatch, useAppSelector } from '../../app/store';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { addTaskInArrayByIdAndNameTC, createTaskTC, fetchTodolistsTC, removeTaskFromArrayTC } from "../../features/TodolistsList/boards-reducer";
import { todolistsAPI } from "../../api/todolists-api";

type Boards = {
  setFormActive: () => void;
};

export type TaskType = {
    _id: string,
    title: string,
    description: string,
    order: number,
    arrayName: string
    boardId: string
}

export type BoardsType = {
  _id: string;
  todoSubBoard: TaskType[];
  inProgressSubBoard: TaskType[];
  doneSubBoard: TaskType[];
};

export const Boards: React.FC<Boards> = ({ setFormActive }) => {
  const boards = useAppSelector<BoardsType[]>(state => state.boards);
  const dispatch = useAppDispatch();
  const isGood = Object.keys(boards).length;

  const onDragEnd = (result: any) => {
        
        const boardId = boards["0"]._id
        const taskId = result.draggableId
        const arrayName = result.source.droppableId
        const nextArrayName = result.destination.droppableId;
        const index = result.source.index
        const nextIndex = result.destination.index

        todolistsAPI.getTaskData(taskId, boardId)
          .then((res) => {
            const title = res.data.title
            const descriptioan = res.data.description

            const thunk = removeTaskFromArrayTC(taskId, boardId, arrayName)
            dispatch(thunk)

            todolistsAPI.decreaseOrderOfRest(boardId, arrayName, index)
              .then((res) => {
                todolistsAPI.increaseOrderOfBigger(boardId, nextArrayName, nextIndex)
                  .then((res) => {
                    setTimeout(() => {
                      const thunk2 = addTaskInArrayByIdAndNameTC(title, descriptioan, taskId, nextArrayName, boardId, nextIndex)
                      dispatch(thunk2)
                    }, 1000)
                  })
                
              })
          
          })

    }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className={s.boardsContainer}>
        {isGood ? (
          <>
            <Droppable droppableId="todoSubBoard" type="TASK">
              {(provided) => (
                <div ref={provided.innerRef} {...provided.droppableProps} >
                  <Board title="To Do" droppableId={"todoSubBoard"} elements={boards[0].todoSubBoard} setFormActive={setFormActive} />
                  {provided.placeholder}
                </div>
              )}
            </Droppable>

            <Droppable droppableId="inProgressSubBoard" type="TASK">
              {(provided) => (
                <div ref={provided.innerRef} {...provided.droppableProps}>
                  <Board title="In Progress" droppableId={"inProgressSubBoard"} elements={boards[0].inProgressSubBoard} />
                  {provided.placeholder}
                </div>
              )}
            </Droppable>

            <Droppable droppableId="doneSubBoard" type="TASK">
              {(provided) => (
                <div ref={provided.innerRef} {...provided.droppableProps}>
                  <Board title="Done" droppableId={"doneSubBoard"} elements={boards[0].doneSubBoard} />
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </>
        ) : (
          ""
        )}
      </div>
    </DragDropContext>
  );
};