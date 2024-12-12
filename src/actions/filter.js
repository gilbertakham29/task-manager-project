export const filterStatus = (tasks, status) => {
  if (!status) return tasks;
  if (tasks.status == "All") {
    return tasks;
  }
  return tasks.filter((task) => task.status === status);
};
