import { useEffect, useState } from "react"
import { Task } from "../_utils/types"
import { useTaskContext } from "../_useContext/task_context"
import { useAuth } from "@/hooks/useAuth"

export default function TaskModal({ isOpen, task, onClose, isEditTask }: { isOpen: boolean, task: Task, onClose: () => void, isEditTask: boolean }) {


    // gestion de l'ouverture et de la fermeture du modal
    const { createTask, updateTask } = useTaskContext()
    const { user } = useAuth()
    const [isClosing, setIsClosing] = useState(false)
    const [taskData, setTaskData] = useState<Task>(task)

    useEffect(() => {
        if (isOpen) {
            setTaskData(task)
        }
    }, [isOpen, task])

    const handleClose = () => {
        setIsClosing(true)
        setTimeout(() => {
            setIsClosing(false)
            onClose()
        }, 500)
    }



    // gestion du submit du formulaire et formatage du payload
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const payload: Task = {
            id: task?.id,
            title: taskData!.title,
            description: taskData?.description,
            assignee: taskData?.assignee,
            deadline: taskData?.deadline,
            priority: taskData?.priority,
            completed: false,
        }

        if (!isEditTask && user?.id) {
            createTask(user?.id, payload)
            handleClose()
        } else if (isEditTask && user?.id) {
            updateTask(user?.id, payload)
            handleClose()
        }
    }

    if (!isOpen) return null
    return (
        <dialog onClose={() => handleClose()} className={` ${isClosing ? 'layout-container-dialog-task-modal-close' : 'layout-container-dialog-task-modal'}`}>
            <div className='layout-container-task-modal-form'>
                <h1 className="text-task-modal-title">Task Modal</h1>
                <p>{taskData?.title}</p>
                <form id="task-form" className="layout-container-task-modal-form-content" onSubmit={handleSubmit}>
                    <label htmlFor="description" className="text-task-modal-form-label">Description of the task</label>
                    <input type="text" name="description" placeholder="Description of the task" className="input-task-modal" value={taskData?.description} onChange={(e) => setTaskData({ ...taskData!, description: e.target.value })} />
                    <label htmlFor="assignee" className="text-task-modal-form-label">Who does it?</label>
                    <input type="text" name="assignee" placeholder="Who does it?" className="input-task-modal" value={taskData?.assignee} onChange={(e) => setTaskData({ ...taskData!, assignee: e.target.value })} />
                    <label htmlFor="deadline" className="text-task-modal-form-label">Date of the deadline</label>
                    <input type="date" name="deadline" className="input-task-modal" value={taskData?.deadline} onChange={(e) => setTaskData({ ...taskData!, deadline: e.target.value })} />
                    <label htmlFor="priority" className="text-task-modal-form-label">Priority</label>
                    <select name="priority" className="input-task-modal" value={taskData?.priority} onChange={(e) => setTaskData({ ...taskData!, priority: e.target.value as 'low' | 'medium' | 'high' })}>
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                    </select>
                </form>
                <div className="layout-container-task-modal-form-buttons">
                    <button onClick={() => handleClose()} className="btn btn-warning p-2 w-[100px] h-[50px]">Annuler</button>
                    {!isEditTask && <button type="submit" form="task-form" className="btn btn-success p-2 w-[100px] h-[50px]">Valider</button>}
                    {isEditTask && <button type="submit" form="task-form" className="btn btn-reverse p-2 w-[100px] h-[50px]">Update</button>}
                </div>
            </div>
        </dialog>
    )
}