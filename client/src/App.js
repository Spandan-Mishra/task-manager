import React, { useEffect, useState } from "react";
import Header from "./components/Header";
import TaskList from "./components/TaskList";
import AddTask from "./components/AddTask";
import DeleteTask from "./components/DeleteTask";
import "./App.css";

const App = () => {
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem("tasks");
    return savedTasks ? JSON.parse(savedTasks) : [];
  });

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const handleAddTask = (newTask) => {
    const newEntry = {
      id: tasks.length + 1,
      taskName: newTask.taskName,
      deadline: newTask.deadline,
      status: false,
    };

    setTasks((prevTasks) => [...prevTasks, newEntry]);
  };

  const toggleTaskCompletion = (id) => {
    const updatedTasks = tasks.map((task) =>
      id === task.id ? { ...task, status: !task.status } : task
    );
    setTasks(updatedTasks);
  };

  const handleDeleteTask = (taskToDelete) => {
    const filteredTasks = tasks.filter(
      (task) => task.id !== Number(taskToDelete.taskId)
    );

    const updatedTasks = filteredTasks.map((task, index) => ({
      ...task,
      id: index + 1,
    }));

    setTasks(updatedTasks);
  };

  return (
    <div>
      <Header />
      {tasks.length ? (
        <TaskList tasks={tasks} onToggle={toggleTaskCompletion} />
      ) : (
        <h2 className="center">Add Tasks!</h2>
      )}
      <AddTask onAdd={handleAddTask} />
      <DeleteTask onDelete={handleDeleteTask} tasks={tasks} />
    </div>
  );
};

export default App;
