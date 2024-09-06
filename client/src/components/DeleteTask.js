import React, { useState } from "react";
import "../App.css";

const DeleteTask = ({ onDelete, tasks }) => {
  const [taskToDelete, setTaskToDelete] = useState({ taskId: "", error: "" });

  const handleChange = (event) => {
    setTaskToDelete((prevTask) => ({
      ...prevTask,
      taskId: event.target.value,
    }));
  };

  const isValid = () => {
    let error=""; 
    const targetTask = tasks.filter((task) => task.id === Number(taskToDelete.taskId));

    if(targetTask.length === 0) {
        error="Please enter valid TaskId";
    }

    if(error) {
        setTaskToDelete(prevTask => ({
            ...prevTask,
            error: error
        }))        
    }
      return error === "";
    }

  const handleSubmit = (event) => {
    event.preventDefault();
    if (isValid()) {
      onDelete(taskToDelete);
      setTaskToDelete({ taskId: "", error: "" });
    }
  };

  return (
    <div className="center">
      <form onSubmit={handleSubmit}>
        <h3 className="center">Delete Tasks here!</h3>
        <input
          name="taskId"
          value={taskToDelete.taskId}
          placeholder="Enter TaskId to delete it"
          onChange={handleChange}
        />
        <div style={{ color: "red", fontSize: 12 }}>{taskToDelete.error}</div>
        <div className="center">
          <button type="submit">Delete Task</button>
        </div>
      </form>
    </div>
  );
};

export default DeleteTask;
