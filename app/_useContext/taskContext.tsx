'use client'
import { createContext, useContext, useState } from "react";
import { Task } from "../_utils/types";
import { deleteTasks, getTasks, postTasks } from "../_api/fetch";

export const TaskContext = createContext<
  | {
    tasks: Task[];
    setTasks: (tasks: Task[]) => void;
    refreshTasks: () => void;
    addTask: (task: Task) => void;
    deleteTask: (id: number) => void;
    newTask: Task | null;
    setNewTask: (task: Task | null) => void;
    isTaskModalOpen: boolean;
    setIsTaskModalOpen: (isOpen: boolean) => void;
    tasksPending: Task[];
    setTasksPending: (tasks: Task[]) => void;
    tasksCompleted: Task[];
    setTasksCompleted: (tasks: Task[]) => void;
  }
  | undefined
>(undefined);

export function TaskProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState<Task | null>(null)
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false)

  const [tasksPending, setTasksPending] = useState<Task[]>([])
  const [tasksCompleted, setTasksCompleted] = useState<Task[]>([])

  const refreshTasks = async () => {
    const data = await getTasks();
    setTasks(data);
  };

  const addTask = async (task: Task) => {
    const data = await postTasks(task)
    setTasks([...tasks, data])
  }

  const deleteTask = async (id: number) => {
    await deleteTasks(id)
    setTasks(tasks.filter((task) => task.id !== id))
  }


  return (
    <TaskContext.Provider value={{ tasks, setTasks, refreshTasks, addTask, deleteTask, newTask, setNewTask, isTaskModalOpen, setIsTaskModalOpen, tasksPending, setTasksPending, tasksCompleted, setTasksCompleted }}>
      {children}
    </TaskContext.Provider>
  );
}


export function useTaskContext() {
  const tasks = useContext(TaskContext)
  if (!tasks) {
    throw new Error('useTaskContext must be used within TaskProvider')
  }
  return tasks
}
