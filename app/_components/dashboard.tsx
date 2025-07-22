import { useTaskContext } from "@/app/_useContext/task_context"
import { useEffect, useReducer, useState } from "react"
import { Task } from "@/app/_utils/types"
import { useRef } from "react"
import { getTaskIdAPI } from "@/app/_api/fetch_tasks"
import { useAuth } from "@/hooks/useAuth"
import TaskModal from "@/app/_components/task_modal"
import InteractionTaskButtons from "@/app/_components/interaction_task_buttons"
import TaskSortMenu from "./task_sort_menu"

export default function Dashboard() {
    const { user, signOut } = useAuth()
    const { stateTasks } = useTaskContext()
    const [newTask, setNewTask] = useState<Partial<Task> | null>(null)
    const [isCreationTaskModalOpen, setIsCreationTaskModalOpen] = useState(false)
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false)
    const [task, setTask] = useState<Task | null>(null)

    const taskInput = useRef<HTMLInputElement>(null)

    const openForm = () => {
        if (taskInput.current?.value && user?.id) {
            setIsCreationTaskModalOpen(true)
            setNewTask({
                completed: false,
                title: taskInput.current?.value,
                description: '',
                assignee: '',
                deadline: '',
                priority: 'low',
                user_id: user.id
            })
            taskInput.current!.value = ''
        }
    }

    const openTaskModalId = (id: number) => {
        if (user?.id) {
            getTaskIdAPI(id, user?.id)
                .then((data) => {
                    setIsTaskModalOpen(true)
                    setTask(data[0])
                })
                .catch((error) => {
                    console.error(error)
                })
        }
    }

    const tasksTablePending = () => {
        return (
            <div className="flex flex-row gap-2 items-center justify-center">
                <div className='layout-container-tasks-individual-col'>
                    {stateTasks.filter((task: Task) => !task.completed).map((task) => (
                        <div className='layout-container-tasks-item' key={task.id}>
                            <InteractionTaskButtons task={task} openTaskId={openTaskModalId} />
                        </div>
                    ))}
                </div>
                <TaskSortMenu />
            </div>
        )
    }

    const tasksTableCompleted = () => {
        return (
            <div className='layout-container-tasks-individual-col'>
                {stateTasks.filter((task: Task) => task.completed).sort((a: Task, b: Task) => {
                    if (a.id && b.id) {
                        return b.id - a.id
                    }
                    return 0
                }).map((task) => (
                    <div className='layout-container-tasks-item' key={task.id}>

                        <InteractionTaskButtons task={task} openTaskId={openTaskModalId} />

                    </div>
                ))}
            </div>
        )
    }

    const keyDownOpenForm = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            openForm()
        }
    }



    return (
        <div className='layout-container-main-page'>
            <h1 className="text-main-title-h1">Daily Flow</h1>
            <button className='btn btn-warning w-[100px] h-[30px] mt-10' onClick={signOut}>Sign Out</button>

            <div className='layout-container-main-page-content'>
                <h2 className="text-tasks-h2">What are we doing today?</h2>
                <div className="layout-container-user-input">
                    <input type="text" placeholder="Task" ref={taskInput} onKeyDown={keyDownOpenForm} className="input-task-entry-title" />
                    <button className="btn btn-primary w-[50px] h-[50px] text-4xl" onClick={openForm} >+</button>
                </div>
                <div className='layout-container-tasks-full-board'>
                    <div className='layout-container-tasks-cols'>
                        <h2 className="text-tasks-h2">Tasks pending</h2>
                        <div>{tasksTablePending()}</div>
                    </div>
                    <div className='layout-container-tasks-cols'>
                        <h2 className="text-tasks-h2">Tasks completed</h2>
                        <div>{tasksTableCompleted()}</div>
                    </div>
                </div>
            </div>
            <TaskModal isOpen={isCreationTaskModalOpen} task={newTask!} onClose={() => setIsCreationTaskModalOpen(false)} isEditTask={false} />
            <TaskModal isOpen={isTaskModalOpen} task={task!} onClose={() => setIsTaskModalOpen(false)} isEditTask={true} />
        </div>
    )
}
