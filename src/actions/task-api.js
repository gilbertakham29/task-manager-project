import axios from "axios";

export const fetchTasks = async () => {
  try {
    const response = await axios.get(
      "https://jsonplaceholder.typicode.com/todos"
    );
    return response.data.slice(0, 20).map((task) => ({
      id: task.id,
      title: task.title,
      description: `Description for task ${task.id}`,
      status: task.completed ? "Done" : "To Do",
    }));
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return [];
  }
};
