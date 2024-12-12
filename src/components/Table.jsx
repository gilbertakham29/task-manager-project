import { TabulatorFull as Tabulator } from "tabulator-tables"; // Import Tabulator.js
import "tabulator-tables/dist/css/tabulator.min.css";
import { useEffect, useRef, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import PropTypes from "prop-types";
import "react-toastify/dist/ReactToastify.css";

const TaskTable = ({ tasks = [], setTasks, deleteTask }) => {
  const tableRef = useRef(null);
  const tabulatorRef = useRef(null); // Reference to the Tabulator instance
  const [searchQuery, setSearchQuery] = useState("");
  const [taskCounts, setTaskCounts] = useState({});

  const calculateCounts = (taskArray) => ({
    "To Do": taskArray.filter((task) => task.status === "To Do").length,
    "In Progress": taskArray.filter((task) => task.status === "In Progress")
      .length,
    Done: taskArray.filter((task) => task.status === "Done").length,
  });

  useEffect(() => {
    // Initialize Tabulator only once
    if (tableRef.current && !tabulatorRef.current) {
      tabulatorRef.current = new Tabulator(tableRef.current, {
        data: tasks, // Initial data
        layout: "fitDataTable",
        responsiveLayout: "hide",
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
            editor: "input", // Inline editor for Title
            width: "25%",
          },
          {
            title: "Description",
            field: "description",
            editor: "textarea", // Inline editor for Description
            width: "35%",
          },
          {
            title: "Status",
            field: "status",
            editor: "select", // Dropdown editor for Status
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
              const id = cell.getRow().getData().id;
              deleteTask(id);
              toast.success("Task deleted successfully!");
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
    }

    // Update table data whenever `tasks` change
    if (tabulatorRef.current) {
      tabulatorRef.current.setData(tasks);
      setTaskCounts(calculateCounts(tasks));
    }
  }, [tasks, setTasks, deleteTask]);

  // Filter tasks based on search query
  useEffect(() => {
    if (tabulatorRef.current) {
      const filteredTasks =
        searchQuery.trim() === ""
          ? tasks
          : tasks.filter(
              (task) =>
                task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                task.description
                  .toLowerCase()
                  .includes(searchQuery.toLowerCase())
            );

      tabulatorRef.current.setData(filteredTasks);
      setTaskCounts(calculateCounts(filteredTasks));
    }
  }, [searchQuery, tasks]);

  return (
    <div className="overflow-x-auto flex flex-col items-center justify-center bg-gray-100 shadow-md rounded-lg">
      <ToastContainer
        position="top-right"
        style={{ width: "50%", height: "15%" }}
        autoClose={3000}
      />
      <div className="w-full max-w-4xl p-4 space-y-4">
        <div className="flex justify-between space-x-4">
          <div className="bg-blue-200 p-2 rounded">
            To Do: {taskCounts["To Do"] || 0}
          </div>
          <div className="bg-yellow-200 p-2 rounded">
            In Progress: {taskCounts["In Progress"] || 0}
          </div>
          <div className="bg-green-200 p-2 rounded">
            Done: {taskCounts["Done"] || 0}
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

TaskTable.propTypes = {
  tasks: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      status: PropTypes.oneOf(["To Do", "In Progress", "Done"]).isRequired,
    })
  ).isRequired,
  setTasks: PropTypes.func.isRequired,
  deleteTask: PropTypes.func.isRequired,
};

export default TaskTable;
