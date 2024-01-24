import React from "react";
import s from "./Board.module.css";
import { Task } from "../Task/Task";
import { Draggable, Droppable } from 'react-beautiful-dnd';

type BoardProps = {
  id?: string,
  title?: string,
  setFormActive?: () => void,
  elements?: TaskType[],
  droppableId: string
};

export type TaskType = {
  _id: string;
  title: string;
  description: string;
  order: number;
  boardId: string;
};

const Board: React.FC<BoardProps> = ({ title, elements, setFormActive, droppableId }) => {
  return (
    <Droppable droppableId={droppableId || "droppableId"} type="TASK">
      {(provided) => (
        <div
          {...provided.droppableProps}
          ref={provided.innerRef}
          className={s.boardContainer}
        >
          <div className={s.boardContainer__title}>{title}</div>
          <div className={s.boardContainer__body}>
            {elements?.map((el, index) => (
              <Draggable key={el._id} draggableId={el._id} index={index}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >
                    <Task
                      _id={el._id}
                      title={el.title}
                      description={el.description}
                      boardId={el.boardId}
                      order={el.order}
                      droppableId={droppableId}
                    />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
            {title === "To Do" ? (
              <div className={s.boardContainer__body__add} onClick={setFormActive}>
                <p>+</p>
              </div>
            ) : (
              ""
            )}
          </div>
        </div>
      )}
    </Droppable>
  );
};

export default Board;