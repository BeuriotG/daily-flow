import { useTaskContext } from "../_useContext/task_context"
import { Task } from "../_utils/types"

export default function InteractionTaskButtons({ task, openTaskId }: { task: Task; openTaskId: (id: number) => void }) {

    const { completeTask, deleteTask } = useTaskContext()

    const formattedTitle = (taskTitle: string) => {
        if (taskTitle.length > 50) {
            return `${task.title.substring(0, 50)} ...`
        }
        return taskTitle
    }

    return (
        <div className='layout-container-task-interaction-bar'>
            <button className='btn btn-open-modal' onClick={() => openTaskId(task.id!)}>{formattedTitle(task.title)}</button>
            <div className='layout-container-task-interaction-bar-buttons'>
                <div>{task.assignee ? task.assignee : 'No assignee'}</div>
                <div>{task.priority ? task.priority : 'No priority'}</div>
                <div>{task.deadline ? task.deadline : 'No deadline'}</div>
                <button
                    className={`btn w-[20px] h-[20px] ${task.completed ? 'btn-reverse' : 'btn-success'}`}
                    onClick={() => completeTask(task.id!)}
                >
                    {task.completed ? '↩' : '✓'}
                </button>
                <button className='btn btn-warning w-[20px] h-[20px]' onClick={() => deleteTask(task.id!)}>X</button>
            </div>

        </div>
    )
}