'use client'
import { useEffect, useRef, useState } from 'react'
import TaskModal from './_components/taskModal'
import { Task } from './_utils/types'
import { getTasks } from './_api/fetch'

export default function Home() {

  const [tasks, setTasks] = useState<Task[]>([])
  useEffect(() => {
    getTasks().then((data) => {
      setTasks(data)
      setTasksPending(data.filter((task: Task) => !task.completed))
      setTasksCompleted(data.filter((task: Task) => task.completed))
    })
  }, [])

  // gestion d'état des tâches
  const [tasksPending, setTasksPending] = useState<Task[]>([])
  const [tasksCompleted, setTasksCompleted] = useState<Task[]>([])
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false)
  const [newTask, setNewTask] = useState<Task | null>(null)
  // fonction de manipulation des tâches
  const addTask = () => {
    if (taskInput.current?.value) {
      setIsTaskModalOpen(true)
      setNewTask({ id: tasksPending.length + 1, completed: false, title: taskInput.current?.value, description: '', assignee: '', deadline: '', priority: 'low' })
      taskInput.current!.value = ''
    }
  }

  const deleteTask = (id: number) => {
    setTasksPending(tasksPending.filter((task) => task.id !== id))
  }

  const completeTask = (id: number) => {
    setTasksPending(tasksPending.filter(task => task.id !== id))
    setTasksCompleted([...tasksCompleted, tasksPending.find(task => task.id === id)!])
  }

  const taskInput = useRef<HTMLInputElement>(null)

  // affichage des tâches
  const tasksTablePending = () => {
    return (
      <div className='flex flex-col gap-2 w-[300px]'>
        {tasksPending.map((task) => (
          <div className='border-2 border-gray-300 rounded-md p-2' key={task.id}>
            <div className='flex items-center justify-between'>
              <div>{task.title}</div>
              <button className='bg-green-500 text-white rounded-md w-[20px] h-[20px] hover:bg-green-600 cursor-pointer' onClick={() => completeTask(task.id)}>✓</button>
              <button className='bg-red-500 text-white rounded-md w-[20px] h-[20px] hover:bg-red-600 cursor-pointer' onClick={() => deleteTask(task.id)}>X</button>
            </div>
          </div>
        ))}
      </div>
    )
  }

  const tasksTableCompleted = () => {
    return (
      <div className='flex flex-col gap-2 w-[300px]'>
        {tasksCompleted.map((task) => (
          <div className='border-2 border-gray-300 rounded-md p-2' key={task.id}>
            <div className='flex items-center justify-between'>
              <div>{task.title}</div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  // gestion de l'ajout de tâche par key.entrée
  const keyDownAddTask = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      addTask()
    }
  }

  return (
    <div>
      <h1 className="text-center text-4xl font-bold mt-10">Daily Flow</h1>

      <div className='flex flex-col items-center justify-center mt-10'>
        <h2 className="text-center text-2xl font-bold my-5">What are we doing today?</h2>
        <div className="flex items-center justify-center gap-2">
          <input type="text" placeholder="Task" ref={taskInput} onKeyDown={keyDownAddTask} className="p-2 rounded-md bg-white w-[500px] h-[50px] text-black" />
          <button className="bg-blue-500 text-white text-center rounded-md w-[50px] h-[50px] text-4xl" onClick={addTask} >+</button>
        </div>
        <div className='flex flex-row gap-2 items-start justify-center mt-10'>
          <div className='flex flex-col items-center justify-center mt-10'>
            <h2 className="text-center text-2xl font-bold my-5">Tasks pending</h2>
            <div>{tasksTablePending()}</div>

          </div>
          <div className='flex flex-col items-center justify-center mt-10'>
            <h2 className="text-center text-2xl font-bold my-5">Tasks completed</h2>
            <div>{tasksTableCompleted()}</div>
          </div>
        </div>
      </div>
      <TaskModal isOpen={isTaskModalOpen} task={newTask!} onClose={() => setIsTaskModalOpen(false)} />
    </div>
  )
}