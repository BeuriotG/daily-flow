'use client'
import { createContext, useContext, useState } from "react";
import { Task } from "../_utils/types";
import { getTasksAPI } from "../_api/fetch";

// Défini le Contexte pour les tâches
export const TaskContext = createContext<
  | {
    tasks: Task[];
    setTasks: (tasks: Task[]) => void;
    refreshTasks: () => void;

  }
  | undefined
>(undefined);

// Défini le Provider pour le Contexte de tâches 
// Est redéfini dans le layout
export function TaskProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);

  const refreshTasks = async () => {
    const data = await getTasksAPI();
    setTasks(data);
  };


  return (
    <TaskContext.Provider value={{ tasks, setTasks, refreshTasks }}>
      {children}
    </TaskContext.Provider>
  );
}

// Hook personnalisé pour utilisé le TaskContext

export function useTaskContext() {
  const tasks = useContext(TaskContext)
  if (!tasks) {
    throw new Error('useTaskContext must be used within TaskProvider')
  }
  return tasks
}
