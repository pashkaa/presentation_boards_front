import axios, { AxiosResponse } from 'axios'
import { BoardsType } from '../components/boards/Boards';

const instance = axios.create({
    baseURL: 'https://presentation-boards.vercel.app/api/',
    withCredentials: false,
})

export type ResponseType<D = {}> = {
    resultCode: number
    messages: Array<string>
    fieldsErrors: Array<string>
    data: D
}

// api
export const todolistsAPI = {

    // BOARDS
    getBoardById(boardId: string) {
        return instance.get<BoardsType[]>(`boards/${boardId}`);
    },
    createBoard() {
        return instance.post(`boards/create`);
    },

    // TASKS
    getTaskData(taskId: string, boardId: string) {
        return instance.get<any>(`/tasks/${boardId}/${taskId}`);
    },
    createTaskWithoutId(title: string, description: string, boardId: string, order: number, arrayName : string) {      
        return instance.post(`tasks/${boardId}`, {title, description, boardId, order, arrayName});
    },
    createTaskWithId(title: string, description: string, taskId: string, boardId: string, order: number, arrayName: string) {      
        return instance.post(`tasks-id/${boardId}`, {title, description, taskId, boardId, order, arrayName});
    },
    deleteTask(taskId: string, boardId: string) {
        return instance.delete(`tasks/${boardId}`,  { data: { "taskId": taskId } });
    },
    updateTask(title: string, description: string, taskId: string, boardId: string) {        
        return instance.put(`tasks/${boardId}`, { "taskId": taskId, "title": title, "description": description } );
    },
    deleteTasks(boardId: string) {
        return instance.delete(`all-tasks/${boardId}`);
    },

    // SUB-ARRAY

    addTaskInArrayByIdAndName(taskId: string, arrayName: string, boardId: string) {
        return instance.patch(`sub-array/add/${boardId}`, {taskId, arrayName});
    },
    removeTaskFromArray(taskId: string, boardId: string, arrayName: string) {
        return instance.patch(`sub-array/remove/${boardId}`,  { taskId, arrayName } );
    },
    deleteBoard(boardId: string) {
        return instance.delete(`sub-array/${boardId}`);
    },
    decreaseOrderOfRest(boardId: string, arrayName: string, order: number) {
        return instance.patch(`sub-array/decrease/${boardId}`, {arrayName, order} );
    },
    increaseOrderOfBigger(boardId: string, arrayName: string, order: number) {
        return instance.patch(`sub-array/increase/${boardId}`, {arrayName, order} );
    },
}