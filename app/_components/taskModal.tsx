import { useEffect, useRef } from "react"
import { Task } from "../_utils/types"
import { postTasks } from "../_api/fetch"

export default function TaskModal({ isOpen, task, onClose }: { isOpen: boolean, task: Task, onClose: () => void }) {
    // gestion de l'ouverture et de la fermeture du modal
    const modalRef = useRef<HTMLDialogElement>(null)

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

        postTasks(payload)
        onClose()
    }

    if (!isOpen) return null
    return (
        <dialog ref={modalRef} open={isOpen} onClose={() => onClose()} className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
            <div className='bg-white p-4 rounded-md w-[800px] h-[800px] flex flex-col items-center justify-start gap-4'>
                <h1 className="text-2xl font-bold">Task Modal</h1>
                <p ref={refs.title}>{task?.title}</p>
                <form id="task-form" className="flex flex-col gap-2" onSubmit={handleSubmit}>
                    <label htmlFor="description" className="text-sm font-bold">Description of the task</label>
                    <input type="text" name="description" placeholder="Description of the task" className="w-[500px] h-[50px] border-2 border-gray-300 rounded-md p-2" ref={refs.description} />
                    <label htmlFor="assignee" className="text-sm font-bold">Who does it?</label>
                    <input type="text" name="assignee" placeholder="Who does it?" className="w-[500px] h-[50px] border-2 border-gray-300 rounded-md p-2" ref={refs.assignee} />
                    <label htmlFor="deadline" className="text-sm font-bold">Date of the deadline</label>
                    <input type="date" name="deadline" className="w-[500px] h-[50px] border-2 border-gray-300 rounded-md p-2" ref={refs.deadline} />
                    <label htmlFor="priority" className="text-sm font-bold">Priority</label>
                    <select name="priority" className="w-[500px] h-[50px] border-2 border-gray-300 rounded-md p-2" ref={refs.priority}>
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                    </select>
                </form>
                <div className="flex flex-row gap-2">
                    <button onClick={onClose} className="bg-red-500 text-white p-2 rounded-md w-[100px] h-[50px] hover:bg-red-600 cursor-pointer">Annuler</button>
                    <button type="submit" form="task-form" className="bg-green-500 text-white p-2 rounded-md w-[100px] h-[50px] hover:bg-green-600 cursor-pointer">Valider</button>
                </div>
            </div>
        </dialog>
    )
}