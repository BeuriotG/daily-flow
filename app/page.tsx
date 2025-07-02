'use client'
import { useRef, useState } from 'react'

export default function Home() {


  const [tasks, setTasks] = useState<string[]>([])
  const addTask = () => {
    if (taskInput.current?.value) {
      setTasks([...tasks, taskInput.current?.value])
      taskInput.current!.value = ''
    }
  }

  const deleteTask = (index: number) => {
    setTasks(tasks.filter((_, i) => i !== index))
  }

  const taskInput = useRef<HTMLInputElement>(null)

  const tasksTable = () => {
    return (
      <div className='flex flex-col gap-2 w-[300px]'>
        {tasks.map((task, index) => (
          <div className='border-2 border-gray-300 rounded-md p-2' key={index}>
            <div className='flex items-center justify-between'>
              <div>{task}</div>
              <button className='bg-red-500 text-white  rounded-md w-[20px] h-[20px] hover:bg-red-600 cursor-pointer' onClick={() => deleteTask(index)}>X</button>
            </div>
          </div>
        ))}
      </div>
    )
  }

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
          <input type="text" placeholder="Task" ref={taskInput} onKeyDown={keyDownAddTask} className=" p-2 rounded-md bg-white w-[500px] h-[50px] text-black" />
          <button className="bg-blue-500 text-white text-center rounded-md w-[50px] h-[50px] text-4xl" onClick={addTask} >+</button>
        </div>
        <div className='flex flex-col items-center justify-center mt-10'>
          <h2 className="text-center text-2xl font-bold my-5">Tasks</h2>
          {tasksTable()}
        </div>
      </div>
    </div>
  )
}