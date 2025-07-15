'use client'
import { createContext, useContext, useEffect, useState } from "react";
import { Task } from "../_utils/types";
import { getTasksAPI } from "../_api/fetch";
import { useAuth } from "@/hooks/useAuth";

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
  const { user, loading } = useAuth();
  const refreshTasks = async () => {
    if (user?.id) {
      const data = await getTasksAPI(user.id);
      setTasks(data);
    }
  };

  useEffect(() => {
    if (!loading && user?.id) {
      refreshTasks()
    }
  }, [user?.id, loading])

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
