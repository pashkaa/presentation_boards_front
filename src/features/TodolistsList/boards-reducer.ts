import { todolistsAPI } from '../../api/todolists-api'
import {Dispatch} from 'redux'
import { BoardsType, TaskType } from '../../components/boards/Boards'

const initialState: BoardsType[] = []

export const boardsReducer = (state: BoardsType[] = initialState, action: ActionsType): BoardsType[] => {
    switch (action.type) {
        case 'SET-TODOLISTS':
        const newState = action.boards.map(board => {
            board.todoSubBoard.sort((a, b) => a.order - b.order);
            board.inProgressSubBoard.sort((a, b) => a.order - b.order);
            board.doneSubBoard.sort((a, b) => a.order - b.order);
            
            return board;
        });
    
        return newState;
        case 'CREATE-TASK':
            const newTask = { _id: action.taskId, title: action.title, description: action.description,
                 boardId: action.boardId, order: action.order, arrayName: action.arrayName};
            return { ...state, ["0"]: {
                 ...state["0"], todoSubBoard : [...state["0"].todoSubBoard, newTask] 
            }}
        case 'DELETE-TASK':
            const updatedTodoSubBoard = state["0"].todoSubBoard.filter(
                (task) => task._id !== action.taskId
            );
            return { ...state, ["0"]: {
                ...state["0"], todoSubBoard: updatedTodoSubBoard 
            }}
        case 'UPDATE-TASK':
            const updatedTodoSubBoard3 = state["0"].todoSubBoard.map((task) =>
                task._id === action.taskId
                ? { ...task, title: action.title, description: action.description }
                : task
            );

            return { ...state, ["0"]: { ...state["0"], todoSubBoard: updatedTodoSubBoard3} };
        case 'ADD-TASK-IN-ARRAY':
            switch(action.arrayName){
                case 'todoSubBoard':
                const newTask = { _id: action.taskId, title: action.title, description: action.description, order: action.order, boardId: action.boardId, arrayName: action.arrayName};
                    return { ...state, ["0"]: {
                        ...state["0"], todoSubBoard: [...state["0"].todoSubBoard, newTask],
                    }}
                case 'inProgressSubBoard':
                const newTask2 = { _id: action.taskId, title: action.title, description: action.description, order: action.order, boardId: action.boardId, arrayName: action.arrayName};
                    return { ...state, ["0"]: {
                        ...state["0"], inProgressSubBoard: [...state["0"].inProgressSubBoard, newTask2],
                    }}
                case 'doneSubBoard':
                const newTask3 = { _id: action.taskId, title: action.title, description: action.description, order: action.order, boardId: action.boardId, arrayName: action.arrayName};
                    return { ...state, ["0"]: {
                        ...state["0"], doneSubBoard: [...state["0"].doneSubBoard, newTask3],
                    }}
                default:
                    return state;
            }
        case 'REMOVE-TASK-FROM-ARRAY':
            switch(action.arrayName){
                case 'todoSubBoard':
                    const updatedTodoSubBoard = state["0"].todoSubBoard.filter(
                        (task) => task._id !== action.taskId
                    );
                    return { ...state, ["0"]: { ...state["0"], todoSubBoard: updatedTodoSubBoard, } };
                case 'inProgressSubBoard':
                    const updatedTodoSubBoard2 = state["0"].inProgressSubBoard.filter(
                        (task) => task._id !== action.taskId
                    );
                    return { ...state, ["0"]: { ...state["0"], inProgressSubBoard: updatedTodoSubBoard2, } };
                case 'doneSubBoard':
                    const updatedTodoSubBoard3 = state["0"].doneSubBoard.filter(
                        (task) => task._id !== action.taskId
                    );
                    return { ...state, ["0"]: { ...state["0"], doneSubBoard: updatedTodoSubBoard3, } };
                default:
                    return state;
            }
        default:
            return state
    }
}

// actions

export const setTodolistsAC = (boards: BoardsType[]) => ({type: 'SET-TODOLISTS', boards} as const)
export const createTaskAC = (taskId: string, boardId: string, title: string, description: string, boardName: string, order: number, arrayName: string) => ({type: 'CREATE-TASK', taskId, boardId, title, description, boardName, order, arrayName} as const)
export const addTaskInArrayByIdAndNameAC = (title: string, description: string, taskId: string, arrayName: string, boardId: string, order: number) => ({type: 'ADD-TASK-IN-ARRAY', title, description, taskId, arrayName, boardId, order} as const)
export const removeTaskFromArrayAC = (taskId: string, boardId: string, arrayName: string) => ({type: 'REMOVE-TASK-FROM-ARRAY', taskId, boardId, arrayName} as const)

export const deleteTaskAC = (taskId: string, boardId: string) => ({type: 'DELETE-TASK', taskId, boardId} as const)
export const updateTaskAC = (taskId: string, title: string, description: string, boardId: string) => ({type: 'UPDATE-TASK', taskId, title, description, boardId} as const)

// thunks

export const fetchTodolistsTC = (boardId: string) => {
    return (dispatch: Dispatch<ActionsType>) => {
        todolistsAPI.getBoardById(boardId)
            .then((res) => {
                dispatch(setTodolistsAC(res.data))
            })
    }
}

export const createTaskTC = (title: string, description: string, arrayName : string, boardId: string, order: number) => {
    return (dispatch: Dispatch<ActionsType>) => {
        todolistsAPI.createTaskWithoutId(title, description, boardId, order, arrayName)
            .then((res) => {    
                const taskId = res.data;
                dispatch(createTaskAC(taskId, boardId, title, description, boardId, order, arrayName))
                
                todolistsAPI.addTaskInArrayByIdAndName(taskId, arrayName, boardId)
                    .then((res) => {
                    })
            })
    }
}

export const deleteTasksTC = (boardId: string) => {
    return (dispatch: Dispatch<ActionsType>) => {
        todolistsAPI.deleteTasks(boardId)
            .then((res) => {
                todolistsAPI.deleteBoard(boardId)
                    .then((res) => {
                        dispatch(setTodolistsAC([]))
                    })
            })
    }
}

export const createBoardTC = () => {
    return (dispatch: Dispatch<ActionsType>) => {
        todolistsAPI.createBoard()
            .then((res) => {
                const boardId = res.data.insertedId
                todolistsAPI.getBoardById(boardId)
                    .then((res) => {
                        alert(`Your new Board ID: ${boardId}`)
                        localStorage.setItem('boardId', boardId)  
                        dispatch(setTodolistsAC(res.data))
                    })
            })
    }
}

export const addTaskInArrayByIdAndNameTC = (title: string, description: string,taskId: string, arrayName: string, boardId: string, order: number) => {
    return (dispatch: Dispatch<ActionsType>) => {
            todolistsAPI.addTaskInArrayByIdAndName(taskId, arrayName, boardId)
                .then((res) => {
                    const taskId = res.data;
                    dispatch(addTaskInArrayByIdAndNameAC(title, description, taskId, arrayName, boardId, order))
                })
                .then((res) => {
                    todolistsAPI.createTaskWithId(title, description, taskId, boardId, order, arrayName)
                    .then((res) => {
                        todolistsAPI.getBoardById(boardId)
                            .then((res) => {
                                dispatch(setTodolistsAC(res.data))
                            })
                    })
                })
        
    }
}

export const removeTaskFromArrayTC = (taskId: string, boardId: string, arrayName: string) => {
    return (dispatch: Dispatch<ActionsType>) => {
        todolistsAPI.removeTaskFromArray(taskId, boardId, arrayName)
            .then((res) => {    
                dispatch(removeTaskFromArrayAC(taskId, boardId, arrayName))
                todolistsAPI.deleteTask(taskId, boardId)
            })
    }
}

export const updateTaskTC = (title: string, description: string, taskId: string, boardId: string) => {
    return (dispatch: Dispatch<ActionsType>) => {
        todolistsAPI.updateTask(title, description, taskId, boardId)
            .then((res) => { 
                dispatch(updateTaskAC(title, description, taskId, boardId))
            })
    }
}

export type SetTodolistsActionType = ReturnType<typeof setTodolistsAC>;
export type CreateTaskActionType = ReturnType<typeof createTaskAC>;
export type DeleteTaskActionType = ReturnType<typeof deleteTaskAC>;
export type UpdateTaskActionType = ReturnType<typeof updateTaskAC>;
export type addTaskInArrayByIdAndNameActionType = ReturnType<typeof addTaskInArrayByIdAndNameAC>;
export type removeTaskFromArrayActionType = ReturnType<typeof removeTaskFromArrayAC>;

type ActionsType =
    | SetTodolistsActionType
    | CreateTaskActionType
    | DeleteTaskActionType
    | UpdateTaskActionType
    | addTaskInArrayByIdAndNameActionType
    | removeTaskFromArrayActionType