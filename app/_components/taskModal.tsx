import { useEffect, useRef } from "react"
import { Task } from "../_utils/types"
import { postTasksAPI, updateTasksAPI } from "../_api/fetch"
import { useTaskContext } from "../_useContext/taskContext"
import { useAuth } from "@/hooks/useAuth"

export default function TaskModal({ isOpen, task, onClose, isEditTask }: { isOpen: boolean, task: Task, onClose: () => void, isEditTask: boolean }) {


    // gestion de l'ouverture et de la fermeture du modal
    const { setTasks, refreshTasks } = useTaskContext()
    const modalRef = useRef<HTMLDialogElement>(null)
    const { user } = useAuth()

    useEffect(() => {
        if (isOpen) {
            modalRef.current?.show()
        }
        else {
            modalRef.current?.close()
        }
    }, [isOpen])

    // gestion des références des inputs
    const refs = {
        title: useRef<HTMLParagraphElement>(null),
        description: useRef<HTMLInputElement>(null),
        assignee: useRef<HTMLInputElement>(null),
        deadline: useRef<HTMLInputElement>(null),
        priority: useRef<HTMLSelectElement>(null),
    }

    // gestion du submit du formulaire et formatage du payload
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const payload = {
            id: task.id,
            title: refs.title.current?.textContent || task.title,
            description: refs.description.current?.value || '',
            assignee: refs.assignee.current?.value || '',
            deadline: refs.deadline.current?.value || '',
            priority: (refs.priority.current?.value as 'low' | 'medium' | 'high') || 'low',
            completed: false,
        }
        if (!isEditTask && user?.id) {
            postTasksAPI(payload, user?.id)
                .then(() => refreshTasks())
                .catch(error => console.error(error))
            onClose()
        } else if (isEditTask && user?.id) {
            updateTasksAPI(payload, user?.id)
                .then(() => refreshTasks())
                .catch(error => console.error(error))
            onClose()
        }
    }

    if (!isOpen) return null
    return (
        <dialog ref={modalRef} open={isOpen} onClose={() => onClose()} className="layout-container-dialog-task-modal bg-black bg-opacity-50">
            <div className='layout-container-task-modal-form'>
                <h1 className="text-task-modal-title">Task Modal</h1>
                <p ref={refs.title}>{task?.title}</p>
                <form id="task-form" className="layout-container-task-modal-form-content" onSubmit={handleSubmit}>
                    <label htmlFor="description" className="text-task-modal-form-label">Description of the task</label>
                    <input type="text" name="description" placeholder="Description of the task" className="input-task-modal" ref={refs.description} defaultValue={task?.description} />
                    <label htmlFor="assignee" className="text-task-modal-form-label">Who does it?</label>
                    <input type="text" name="assignee" placeholder="Who does it?" className="input-task-modal" ref={refs.assignee} defaultValue={task?.assignee} />
                    <label htmlFor="deadline" className="text-task-modal-form-label">Date of the deadline</label>
                    <input type="date" name="deadline" className="input-task-modal" ref={refs.deadline} defaultValue={task?.deadline} />
                    <label htmlFor="priority" className="text-task-modal-form-label">Priority</label>
                    <select name="priority" className="input-task-modal" ref={refs.priority}>
                        <option value="low" selected={task?.priority === 'low'}>Low</option>
                        <option value="medium" selected={task?.priority === 'medium'}>Medium</option>
                        <option value="high" selected={task?.priority === 'high'}>High</option>
                    </select>
                </form>
                <div className="layout-container-task-modal-form-buttons">
                    <button onClick={onClose} className="btn btn-warning p-2 w-[100px] h-[50px]">Annuler</button>
                    {!isEditTask && <button type="submit" form="task-form" className="btn btn-success p-2 w-[100px] h-[50px]">Valider</button>}
                    {isEditTask && <button type="submit" form="task-form" className="btn btn-reverse p-2 w-[100px] h-[50px]">Update</button>}
                </div>
            </div>
        </dialog>
    )
}