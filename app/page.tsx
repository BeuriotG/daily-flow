'use client'
import { useEffect, useRef, useState } from 'react'
import TaskModal from './_components/taskModal'
import InteractionTaskButtons from './_components/interactionTaskButtons'
import { Task } from './_utils/types'
import { useTaskContext } from './_useContext/taskContext'
import { getTaskIdAPI } from './_api/fetch'
import { useAuth } from '@/hooks/useAuth'
import Auth from './auth/page'

export default function Home() {

  const { user, loading, signOut } = useAuth()
  const { tasks, refreshTasks } = useTaskContext()

  useEffect(() => {
    if (user?.id) {
      console.log(user.id)
      refreshTasks()
    }
  }, [user?.id])

  // gestion d'état des tâches

  const [newTask, setNewTask] = useState<Task | null>(null)
  const [isCreationTaskModalOpen, setIsCreationTaskModalOpen] = useState(false)
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false)
  const [task, setTask] = useState<Task | null>(null)
  // récupération des tâches
  const tasksPending = tasks.filter((task: Task) => !task.completed)
  const tasksCompleted = tasks.filter((task: Task) => task.completed)

  const taskInput = useRef<HTMLInputElement>(null)
  // fonction de manipulation des tâches
  const openForm = () => {
    if (taskInput.current?.value && user?.id) {
      setIsCreationTaskModalOpen(true)
      setNewTask({
        id: tasksPending.length + 1,
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

  // affichage des tâches
  const tasksTablePending = () => {
    return (
      <div className='layout-container-tasks-individual-col'>
        {tasksPending.map((task) => (
          <div className='layout-container-tasks-item' key={task.id}>

            <InteractionTaskButtons task={task} openTaskId={openTaskModalId} />

          </div>
        ))}
      </div>
    )
  }

  const tasksTableCompleted = () => {
    return (
      <div className='layout-container-tasks-individual-col'>
        {tasksCompleted.map((task) => (
          <div className='layout-container-tasks-item' key={task.id}>

            <InteractionTaskButtons task={task} openTaskId={openTaskModalId} />

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

  if (loading) {
    return <div>Loading...</div>
  }
  if (!user) {
    return <Auth />
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

