import { supabase } from "@/integrations/supabase/client";

export async function createTask(taskDescription: string) {
  // Validate input on client side (server also validates)
  if (!taskDescription || typeof taskDescription !== 'string') {
    console.error('taskDescription is required and must be a string');
    return null;
  }

  if (taskDescription.length > 5000) {
    console.error('taskDescription must be less than 5000 characters');
    return null;
  }

  const { data, error } = await supabase.functions.invoke('create-task', {
    body: { taskDescription }
  });

  if (error) {
    console.error('Failed to create task:', error.message);
    return null;
  }

  console.log('Task created successfully!');
  return data;
}
