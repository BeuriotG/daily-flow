export interface Task {
  id?: number;
  user_id?: string;
  title: string;
  description?: string;
  assignee?: string;
  deadline?: string;
  priority: "low" | "medium" | "high";
  completed: boolean;
  created_at?: string;
}
