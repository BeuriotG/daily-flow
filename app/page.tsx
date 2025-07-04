'use client'
import { useEffect, useRef, useState } from 'react'
import TaskModal from './_components/taskModal'
import { Task } from './_utils/types'
import { useTaskContext } from './_useContext/taskContext'
import { deleteTasksAPI, updateTasksAPI } from './_api/fetch'


export default function Home() {

  const { tasks, setTasks, refreshTasks } = useTaskContext()

  useEffect(() => {
    refreshTasks()
  }, [])

  // gestion d'état des tâches

  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false)
  const [newTask, setNewTask] = useState<Task | null>(null)

  // récupération des tâches
  const tasksPending = tasks.filter((task: Task) => !task.completed)
  const tasksCompleted = tasks.filter((task: Task) => task.completed)

  const taskInput = useRef<HTMLInputElement>(null)
  // fonction de manipulation des tâches
  const openForm = () => {
    if (taskInput.current?.value) {
      setIsTaskModalOpen(true)
      setNewTask({ id: tasksPending.length + 1, completed: false, title: taskInput.current?.value, description: '', assignee: '', deadline: '', priority: 'low' })
      taskInput.current!.value = ''
    }
  }



  // affichage des tâches
  const tasksTablePending = () => {
    return (
      <div className='flex flex-col gap-2 w-[300px]'>
        {tasksPending.map((task) => (
          <div className='border-2 border-gray-300 rounded-md p-2' key={task.id}>

            <InteractionTabTasks task={task} />

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

            <InteractionTabTasks task={task} />

          </div>
        ))}
      </div>
    )
  }

  // gestion de l'ajout de tâche par key.entrée
  const keyDownOpenForm = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      openForm()
    }
  }

  return (
    <div>
      <h1 className="text-center text-4xl font-bold mt-10">Daily Flow</h1>

      <div className='flex flex-col items-center justify-center mt-10'>
        <h2 className="text-center text-2xl font-bold my-5">What are we doing today?</h2>
        <div className="flex items-center justify-center gap-2">
          <input type="text" placeholder="Task" ref={taskInput} onKeyDown={keyDownOpenForm} className="p-2 rounded-md bg-white w-[500px] h-[50px] text-black" />
          <button className="bg-blue-500 text-white text-center rounded-md w-[50px] h-[50px] text-4xl" onClick={openForm} >+</button>
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

function InteractionTabTasks({ task }) {

  const { tasks, setTasks, refreshTasks } = useTaskContext()

  const completeTask = (id: number) => {
    const task = tasks.find((task: Task) => task.id === id)
    if (task) {
      updateTasksAPI({ ...task, completed: !task.completed })
        .then(() => refreshTasks())
        .catch(error => console.error(error))

    }
  }

  const deleteTask = (id: number) => {
    deleteTasksAPI(id)
      .then(() => refreshTasks())
      .catch(error => console.error(error))
    refreshTasks()
  }

  return (
    <div className='flex items-center justify-center gap-10'>
      <div className='flex-1'>{task.title}</div>
      <div className='flex flex-none gap-5'>
        <button className='bg-green-500 text-white rounded-md w-[20px] h-[20px] hover:bg-green-600 cursor-pointer' onClick={() => completeTask(task.id)}>✓</button>
        <button className='bg-red-500 text-white rounded-md w-[20px] h-[20px] hover:bg-red-600 cursor-pointer' onClick={() => deleteTask(task.id)}>X</button>
      </div>
    </div>
  )
}