import { useTaskContext } from "../_useContext/task_context"
import { Task } from "../_utils/types"

export default function InteractionTaskButtons({ task, openTaskId }: { task: Task; openTaskId: (id: number) => void }) {

    const { completeTask, deleteTask } = useTaskContext()



    return (

        <div className='layout-container-task-interaction-bar-buttons'>
            <button
                className={`btn w-[20px] h-[20px] ${task.completed ? 'btn-reverse' : 'btn-success'}`}
                onClick={() => completeTask(task.id!)}
            >
                {task.completed ? '↩' : '✓'}
            </button>
            <button className='btn btn-warning w-[20px] h-[20px]' onClick={() => deleteTask(task.id!)}>X</button>
        </div>
    )
}