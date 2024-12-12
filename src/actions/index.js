import { toast } from "react-toastify";
export const addNewTasks = (tasks, newTasks, setTasks, setNewTask) => {
  if (!newTasks.title || !newTasks.description) {
    toast.error("Please fill in all fields!");
    return;
  }
  const newTask = {
    id: tasks.length + 1,
    title: newTasks.title,
    description: newTasks.description,
    status: newTasks.status,
  };
  setTasks((prevTasks) => [...prevTasks, newTask]);
  setNewTask({ title: "", description: "", status: "To Do" });
  toast.success("Task added successfully!");
};
export const deleteTasks = (id, setTasks) => {
  setTasks((prevTasks) => prevTasks.filter((task) => task.id != id));

  toast.success("Task deleted successfully!");
};
