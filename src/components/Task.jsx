import { useEffect, useState } from "react";
import { fetchTasks } from "../actions/task-api";
import { filterStatus } from "../actions/filter";
import { addNewTasks, deleteTasks } from "../actions";
import TaskTable from "./Table";

export default function Task() {
  const [tasks, setTasks] = useState([]);

  const [filterStatusTask, setFilterStatus] = useState("");

  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    status: "To Do",
  });
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTask((prev) => ({ ...prev, [name]: value }));
  };
  const handleFilterChange = (e) => {
    setFilterStatus(e.target.value);
  };
  //Handle search query

  // Filter tasks based on the selected filter status

  useEffect(() => {
    const taskData = async () => {
      const fetchTaskData = await fetchTasks();
      setTasks(fetchTaskData);
    };
    taskData();
  }, []);
  const filteredTasks = filterStatus(tasks, filterStatusTask);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Task List Manager</h1>

      <div className="bg-white p-6 rounded shadow-md mb-6">
        <h2 className="text-lg font-semibold mb-4">Add New Task</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            name="title"
            value={newTask.title}
            onChange={handleInputChange}
            placeholder="Title"
            className="border p-2 rounded"
          />
          <input
            type="text"
            name="description"
            value={newTask.description}
            onChange={handleInputChange}
            placeholder="Description"
            className="border p-2 rounded"
          />
          <select
            name="status"
            value={newTask.status}
            onChange={handleInputChange}
            className="border p-2 rounded"
          >
            <option value="To Do">To Do</option>
            <option value="In Progress">In Progress</option>
            <option value="Done">Done</option>
          </select>
        </div>
        <button
          onClick={() => addNewTasks(tasks, newTask, setTasks, setNewTask)}
          className="bg-blue-500 text-white py-2 px-4 rounded mt-4 hover:bg-blue-600"
        >
          Add Task
        </button>
      </div>
      <div className="bg-white p-4 rounded shadow-md mb-6 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Filter Tasks</h2>
        <select
          value={filterStatusTask}
          onChange={handleFilterChange}
          className="border p-2 rounded"
        >
          <option value="All">All</option>
          <option value="To Do">To Do</option>
          <option value="In Progress">In Progress</option>
          <option value="Done">Done</option>
        </select>
      </div>
      <TaskTable
        tasks={filteredTasks}
        setTasks={setTasks}
        deleteTask={(id) => deleteTasks(id, setTasks)}
      />
    </div>
  );
}
