import { Task } from "../_utils/types";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const getTasksAPI = async (): Promise<any> => {
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/tasks?select=*`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        apikey: SUPABASE_ANON_KEY!,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      },
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Fetch error:", error);
    return [];
  }
};

export const postTasksAPI = async (payload: Task): Promise<any> => {
  const processedPayload = {
    title: payload.title,
    description: payload.description,
    assignee: payload.assignee,
    deadline: payload.deadline,
    priority: payload.priority,
    completed: false,
  };
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/tasks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: SUPABASE_ANON_KEY!,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify(processedPayload),
    });
  } catch (error) {
    console.error("Fetch error:", error);
    return null;
  }
};

export const updateTasksAPI = async (payload: Task): Promise<any> => {
  const processedPayload = {
    title: payload.title,
    description: payload.description,
    assignee: payload.assignee,
    deadline: payload.deadline,
    priority: payload.priority,
    completed: payload.completed,
  };
  try {
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/tasks?id=eq.${payload.id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          apikey: SUPABASE_ANON_KEY!,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify(processedPayload),
      }
    );
  } catch (error) {
    console.error("Fetch error:", error);
    return null;
  }
};

export const deleteTasksAPI = async (id: number): Promise<any> => {
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/tasks?id=eq.${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        apikey: SUPABASE_ANON_KEY!,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      },
    });
  } catch (error) {
    console.error("Fetch error:", error);
    return null;
  }
};

export const getTaskIdAPI = async (id: number): Promise<any> => {
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/tasks?id=eq.${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        apikey: SUPABASE_ANON_KEY!,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      },
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("fetch error:", error);
    return null;
  }
};
