import { TabulatorFull as Tabulator } from "tabulator-tables"; // Import Tabulator.js
import "tabulator-tables/dist/css/tabulator.min.css";
import { useEffect, useRef, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import PropTypes from "prop-types";
// eslint-disable-next-line react/prop-types
const TaskTable = ({ tasks = [], setTasks, deleteTask }) => {
  const tableRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredTasks, setFilteredTasks] = useState(tasks);
  const calculateCounts = (taskArray) => ({
    "To Do": taskArray.filter((task) => task.status === "To Do").length,
    "In Progress": taskArray.filter((task) => task.status === "In Progress")
      .length,
    Done: taskArray.filter((task) => task.status === "Done").length,
  });
  const [taskCounts, setTaskCounts] = useState(calculateCounts(tasks));
  // Initialize Tabulator table
  useEffect(() => {
    const updatedFilteredTasks =
      searchQuery.trim() === ""
        ? tasks
        : tasks.filter(
            (task) =>
              task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
              task.description.toLowerCase().includes(searchQuery.toLowerCase())
          );
    setFilteredTasks(updatedFilteredTasks);
    setTaskCounts(calculateCounts(tasks));
    if (tableRef.current) {
      const table = new Tabulator(tableRef.current, {
        data: updatedFilteredTasks, // Pass the tasks as data
        layout: "fitDataTable",
        // Adjust columns to fit the container width
        columns: [
          {
            title: "Task ID",
            field: "id",
            width: 100,
            editor: false, // No editing for ID
          },
          {
            title: "Title",
            field: "title",
            editor: "input",
            width: "25%", // Inline editor for Title
          },
          {
            title: "Description",
            field: "description",
            editor: "textarea",
            width: "35%", // Inline editor for Description
          },
          {
            title: "Status",
            field: "status",
            editor: "textarea", // Dropdown editor for Status
            editorParams: {
              values: ["To Do", "In Progress", "Done"], // Dropdown options
            },
            width: "15%",
          },
          {
            title: "Actions",
            formatter: "buttonCross", // Cross button for delete
            align: "center",
            width: 100,
            cellClick: (e, cell) => {
              deleteTask(cell.getRow().getData().id); // Handle task deletion
            },
          },
        ],
        cellEdited: (cell) => {
          const updatedRow = cell.getRow().getData();
          setTasks((prevTasks) =>
            prevTasks.map((task) =>
              task.id === updatedRow.id ? updatedRow : task
            )
          );
          toast.success("Task updated successfully!");
        },
      });

      // Cleanup on unmount
      return () => table.destroy();
    }
  }, [tasks, setTasks, searchQuery, deleteTask, filteredTasks]);

  return (
    <div className="overflow-x-auto flex flex-col items-center justify-center bg-gray-100  shadow-md rounded-lg">
      <ToastContainer
        position="top-right"
        style={{ width: "50%", height: "15%" }}
        autoClose={3000}
      />
      <div className="w-full max-w-4xl p-4 space-y-4">
        <div className="flex justify-between space-x-4">
          <div className="bg-blue-200 p-2 rounded">
            To Do: {taskCounts["To Do"]}
          </div>
          <div className="bg-yellow-200 p-2 rounded">
            In Progress: {taskCounts["In Progress"]}
          </div>
          <div className="bg-green-200 p-2 rounded">
            Done: {taskCounts["Done"]}
          </div>
        </div>
        <input
          type="text"
          className="w-full p-2 border rounded"
          placeholder="Search by Title or Description"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <div ref={tableRef}></div>
    </div>
  );
};
TaskTable.PropTypes = {
  tasks: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      status: PropTypes.oneOf(["To Do", "In Progress", "Done"]),
    })
  ),
  setTasks: PropTypes.func.isRequired,
  deleteTask: PropTypes.func.isRequired,
};
export default TaskTable;
