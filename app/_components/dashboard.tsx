import { useTaskContext } from "@/app/_useContext/task_context"
import { useEffect, useRef, useState } from "react"
import { Task } from "@/app/_utils/types"
import { getTaskIdAPI } from "@/app/_api/fetch_tasks"
import { useAuth } from "@/hooks/useAuth"
import TaskModal from "@/app/_components/task_modal"
import InteractionTaskButtons from "@/app/_components/interaction_task_buttons"
import TaskSortMenu from "./task_sort_menu"
import { formattedTitle, priorityColor, deadlineColor } from "@/app/_helpers/taskUtils"

export default function Dashboard() {
    const { user, signOut } = useAuth()
    const { stateTasks } = useTaskContext()
    const [newTask, setNewTask] = useState<Task | null>(null)
    const [isCreationTaskModalOpen, setIsCreationTaskModalOpen] = useState(false)
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false)
    const [task, setTask] = useState<Task | null>(null)

    const taskInput = useRef<HTMLInputElement>(null)

    const openForm = () => {
        if (taskInput.current?.value && user?.id) {
            setIsCreationTaskModalOpen(true)
            setNewTask({
                completed: false,
                title: taskInput.current?.value || '',
                description: '',
                assignee: '',
                deadline: '',
                priority: 'low',
                user_id: user.id
            })
            taskInput.current!.value = ''
        }
    }

    useEffect(() => {
        if (task) {
            setIsTaskModalOpen(true)
        }
    }, [task])

    useEffect(() => {
        if (newTask) {
            setIsCreationTaskModalOpen(true)
        }
    }, [newTask])

    const openTaskModalId = (id: number) => {
        if (user?.id) {
            setTask(stateTasks.find((task: Task) => task.id === id)!)
        }
    }

    const headers = [
        { title: "Task" },
        { title: "Assignee", field: "assignee" },
        { title: "Priority", field: "priority" },
        { title: "Deadline", field: "deadline" },
        { title: "Actions" }
    ]



    const tasksTable = (isCompleted: boolean) => {
        return (
            <table className="w-[1000px] table-fixed text-black border-collapse">
                <thead className="bg-gray-200 border-solid border-b-2 border-black h-[50px]">
                    <tr>
                        {headers.map((header) => {
                            if (header.field) {
                                return <th key={header.field}><TaskSortMenu title={header.title} field={header.field} /></th>
                            } else {
                                return <th key={header.title}>{header.title}</th>
                            }
                        })}
                    </tr>
                </thead>
                <tbody className="">
                    {stateTasks.filter((task: Task) => isCompleted ? task.completed : !task.completed).map((task) => (
                        <tr key={task.id} className=" border-y-2 border-black bg-gray-200 h-[50px]">
                            <td className="px-2 text-start cursor-pointer hover:bg-gray-300" onClick={() => openTaskModalId(task.id!)}>{formattedTitle(task.title)}</td>
                            <td className="text-center">{task.assignee}</td>
                            <td className="text-center">
                                <span className={`px-2 py-1 rounded-full text-white text-xs font-semibold ${priorityColor(task.priority)}`}>
                                    {task.priority}
                                </span>
                            </td>
                            <td className="text-center">
                                <span className={`px-2 py-1 rounded-full text-white text-xs font-semibold ${deadlineColor(task.deadline!)}`}>
                                    {task.deadline}
                                </span>
                            </td>
                            <td>
                                <InteractionTaskButtons task={task} />
                            </td>
                        </tr>
                    ))}
                </tbody>

            </table >
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
                        <div>{tasksTable(false)}</div>
                    </div>
                    <div className='layout-container-tasks-cols'>
                        <h2 className="text-tasks-h2">Tasks completed</h2>
                        <div>{tasksTable(true)}</div>
                    </div>
                </div>
            </div>
            <TaskModal isOpen={isCreationTaskModalOpen} task={newTask!} onClose={() => setIsCreationTaskModalOpen(false)} isEditTask={false} />
            <TaskModal isOpen={isTaskModalOpen} task={task!} onClose={() => setIsTaskModalOpen(false)} isEditTask={true} />
        </div>
    )
}
