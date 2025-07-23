import { Task } from "../_utils/types";
import { supabase } from "@/lib/supabase";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const getTasksAPI = async (userId: string): Promise<Task[]> => {
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      throw new Error("No session found");
    }

    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/tasks?select=*&user_id=eq.${userId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          apikey: SUPABASE_ANON_KEY!,
          Authorization: `Bearer ${session.access_token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Fetch error:", error);
    return [];
  }
};

export const postTasksAPI = async (
  payload: Task,
  userId: string
): Promise<Task | null> => {
  const processedPayload = {
    title: payload.title,
    description: payload.description,
    assignee: payload.assignee,
    deadline: payload.deadline,
    priority: payload.priority,
    completed: false,
    user_id: userId,
  };

  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      throw new Error("No session found");
    }

    const response = await fetch(`${SUPABASE_URL}/rest/v1/tasks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: SUPABASE_ANON_KEY!,
        Authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify(processedPayload),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Fetch error:", error);
    return null;
  }
};

export const updateTasksAPI = async (
  payload: Task,
  userId: string
): Promise<Task | null> => {
  const processedPayload = {
    title: payload.title,
    description: payload.description,
    assignee: payload.assignee,
    deadline: payload.deadline,
    priority: payload.priority,
    completed: payload.completed,
    user_id: userId,
  };
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      throw new Error("No session found");
    }
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/tasks?id=eq.${payload.id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          apikey: SUPABASE_ANON_KEY!,
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify(processedPayload),
      }
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Fetch error:", error);
    return null;
  }
};

export const deleteTasksAPI = async (
  id: number,
  userId: string
): Promise<Task | null> => {
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      throw new Error("No session found");
    }
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/tasks?id=eq.${id}&user_id=eq.${userId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          apikey: SUPABASE_ANON_KEY!,
          Authorization: `Bearer ${session.access_token}`,
        },
      }
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Fetch error:", error);
    return null;
  }
};

export const getTaskIdAPI = async (
  id: number,
  userId: string
): Promise<Task | null> => {
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      throw new Error("No session found");
    }
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/tasks?id=eq.${id}&user_id=eq.${userId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          apikey: SUPABASE_ANON_KEY!,
          Authorization: `Bearer ${session.access_token}`,
        },
      }
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("fetch error:", error);
    return null;
  }
};
