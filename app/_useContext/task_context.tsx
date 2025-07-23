'use client'
import { createContext, useContext, useEffect, useReducer, useState } from "react";
import { Task } from "../_utils/types";
import { deleteTasksAPI, getTasksAPI, postTasksAPI, updateTasksAPI } from "../_api/fetch_tasks";
import { useAuth } from "@/hooks/useAuth";

// Défini le Contexte pour les tâches
export const TaskContext = createContext<
  | {
    stateTasks: Task[];
    refreshTasks: () => void;
    sortBy: (sortParam: string, direction: string) => void;
    completeTask: (id: number) => void;
    deleteTask: (id: number) => void;
    updateTask: (userId: string, payload: Task) => void;
    createTask: (userId: string, payload: Task) => void;
  }
  | undefined
>(undefined);

// Défini le Provider pour le Contexte de tâches 
// Est redéfini dans le layout
export function TaskProvider({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  // Refacto en cours 

  type TaskAction =
    | { type: 'INITIALIZE_TASKS', payload: Task[] }
    | { type: 'ADD_TASK', payload: Task }
    | { type: 'TOGGLE_COMPLETE', payload: Task }
    | { type: 'DELETE_TASK', payload: Task }
    | { type: 'UPDATE_TASK', payload: Task }
    | { type: 'SORT_BY_DEADLINE', payload: Task[] }
    | { type: 'SORT_BY_PRIORITY', payload: Task[] }
    | { type: 'SORT_BY_ASSIGNEE', payload: Task[] }
  const taskReducer = (state: Task[], action: TaskAction): Task[] => {
    switch (action.type) {
      case 'INITIALIZE_TASKS':
        return action.payload
      case 'ADD_TASK':
        return [...state, action.payload]
      case 'TOGGLE_COMPLETE':
        return state.map((task) => task.id === action.payload.id ? { ...task, completed: !task.completed } : task)
      case 'DELETE_TASK':
        return state.filter((task) => task.id !== action.payload.id)
      case 'UPDATE_TASK':
        return state.map((task) => task.id === action.payload.id ? { ...task, ...action.payload } : task)
      case 'SORT_BY_DEADLINE':
        return action.payload
      case 'SORT_BY_PRIORITY':
        return action.payload
      case 'SORT_BY_ASSIGNEE':
        return action.payload
      default:
        return state
    }
  }

  const [stateTasks, dispatchTasks] = useReducer(taskReducer, [])

  // Refacto en cours

  const refreshTasks = async () => {
    if (user?.id) {
      try {
        const tasks = await getTasksAPI(user.id);
        if (tasks) {
          const sortedByPriorityTasks = tasks.sort((a, b) => {
            if (a.priority && b.priority) {
              const priorityOrder = ['high', 'medium', 'low']
              return priorityOrder.indexOf(a.priority) - priorityOrder.indexOf(b.priority)
            }
            return 0
          })
          dispatchTasks({ type: 'INITIALIZE_TASKS', payload: sortedByPriorityTasks });
        }
      } catch (error) {
        alert('Error during sync with the server')
      }
    }
  };

  const createTask = async (userId: string, payload: Task) => {
    if (user?.id && payload) {
      try {
        await postTasksAPI(payload, userId)
        refreshTasks()
      }
      catch (error) {
        alert('Error during sync with the server')
      }
    }
  }

  const completeTask = async (id: number) => {
    const task = stateTasks.find((task: Task) => task.id === id)
    dispatchTasks({ type: 'TOGGLE_COMPLETE', payload: task! })
    try {
      if (user?.id && task) {
        await updateTasksAPI({ ...task, completed: !task.completed }, user.id)
      }
    } catch (error) {
      dispatchTasks({ type: 'TOGGLE_COMPLETE', payload: task! })
      alert('Error during sync with the server')
    }
  }

  const updateTask = async (userId: string, payload: Task) => {
    const task = stateTasks.find((task: Task) => task.id === payload.id)
    console.log(task)
    if (task && userId) {
      dispatchTasks({ type: 'UPDATE_TASK', payload: payload })
      try {
        await updateTasksAPI(payload, userId)
      } catch (error) {
        dispatchTasks({ type: 'UPDATE_TASK', payload: task! })
        alert('Error during sync with the server')
      }
    }

  }


  const deleteTask = async (id: number) => {
    const task = stateTasks.find((task: Task) => task.id === id)
    dispatchTasks({ type: 'DELETE_TASK', payload: task! })
    if (user?.id && task) {
      try {
        await deleteTasksAPI(id, user?.id)
      }
      catch (error) {
        dispatchTasks({ type: 'ADD_TASK', payload: task! })
        alert('Error during sync with the server')
      }
    }
  }

  const sortBy = (sortParam: string, direction: string) => {
    const sortedTasks = stateTasks.filter((task: Task) => !task.completed).sort((a: Task, b: Task) => {
      if (sortParam === 'deadline' && a.deadline && b.deadline) {
        if (a.deadline === b.deadline) {
          return 0;
        }
        switch (direction) {
          case 'asc':
            return new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
          case 'desc':
            return new Date(b.deadline).getTime() - new Date(a.deadline).getTime()
          case 'neutral':
            refreshTasks()
            break
        }
      }
      else if (sortParam === 'priority' && a.priority && b.priority) {
        if (a.priority === b.priority) {
          return 0;
        }
        const priorityOrder = ['high', 'medium', 'low']
        switch (direction) {
          case 'asc':
            return priorityOrder.indexOf(a.priority) - priorityOrder.indexOf(b.priority)
          case 'desc':
            return priorityOrder.indexOf(b.priority) - priorityOrder.indexOf(a.priority)
          case 'neutral':
            refreshTasks()
            break
        }
      }
      else if (sortParam === 'assignee' && a.assignee && b.assignee) {
        if (a.assignee === b.assignee) {
          return 0;
        }
        switch (direction) {
          case 'asc':
            return a.assignee.localeCompare(b.assignee)
          case 'desc':
            return b.assignee.localeCompare(a.assignee)
          case 'neutral':
            refreshTasks()
            break
        }
      }
      else {
        return 0;
      }
    })
    switch (sortParam) {
      case 'deadline':
        dispatchTasks({ type: 'SORT_BY_DEADLINE', payload: [...sortedTasks, ...stateTasks.filter((task: Task) => task.completed)] })
        break
      case 'priority':
        dispatchTasks({ type: 'SORT_BY_PRIORITY', payload: [...sortedTasks, ...stateTasks.filter((task: Task) => task.completed)] })
        break
      case 'assignee':
        dispatchTasks({ type: 'SORT_BY_ASSIGNEE', payload: [...sortedTasks, ...stateTasks.filter((task: Task) => task.completed)] })
        break
      default:
        refreshTasks()
    }


  }

  useEffect(() => {
    if (!loading && user?.id) {
      refreshTasks()
    }
  }, [user?.id, loading])





  return (
    <TaskContext.Provider value={{ stateTasks, refreshTasks, sortBy, completeTask, deleteTask, updateTask, createTask }}>
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
