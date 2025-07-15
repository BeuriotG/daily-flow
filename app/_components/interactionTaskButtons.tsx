import { useTaskContext } from "../_useContext/taskContext"
import { useAuth } from "@/hooks/useAuth"
import { Task } from "../_utils/types"
import { deleteTasksAPI, updateTasksAPI } from "../_api/fetch"

export default function InteractionTaskButtons({ task, openTaskId }: { task: Task; openTaskId: (id: number) => void }) {

    const { tasks, refreshTasks } = useTaskContext()
    const { user } = useAuth()
    const completeTask = (id: number) => {
        const task = tasks.find((task: Task) => task.id === id)
        if (task && user?.id) {
            updateTasksAPI({ ...task, completed: !task.completed }, user?.id)
                .then(() => refreshTasks())
                .catch(error => console.error(error))

        }
    }



    const deleteTask = (id: number) => {
        if (user?.id) {
            deleteTasksAPI(id, user?.id)
                .then(() => refreshTasks())
                .catch(error => console.error(error))
        }
    }

    const formattedTitle = (taskTitle: string) => {
        if (taskTitle.length > 20) {
            return `${task.title.substring(0, 19)} ...`
        }
        return taskTitle
    }



    return (
        <div className='layout-container-task-interaction-bar'>
            <button className='btn btn-open-modal' onClick={() => openTaskId(task.id)}>{formattedTitle(task.title)}</button>
            <div className='layout-container-task-interaction-bar-buttons'>
                <button
                    className={`btn w-[20px] h-[20px] ${task.completed ? 'btn-reverse' : 'btn-success'}`}
                    onClick={() => completeTask(task.id)}
                >
                    {task.completed ? '↩' : '✓'}
                </button>
                <button className='btn btn-warning w-[20px] h-[20px]' onClick={() => deleteTask(task.id)}>X</button>
            </div>
        </div>
    )
}