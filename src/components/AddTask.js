import React, { useState } from "react";
import "../App.css";

const AddTask = ({ onAdd }) => {
  const [newTask, setNewTask] = useState({
    taskName: "",
    deadline: "",
    error: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setNewTask((prevTask) => ({
      ...prevTask,
      [name]: value,
    }));
  };

  const isValid = () => {
    const days = [
      "monday",
      "tuesday",
      "wednesday",
      "friday",
      "thursday",
      "saturday",
      "sunday",
    ];
    let error = "";
    if (!newTask.taskName || !newTask.deadline) {
        error = "Please fill all fields";
    }
    else if (!days.includes(newTask.deadline.toLowerCase())) {
      error = "Enter valid day of the week";
    }

    if (error) {
      setNewTask((prevTask) => ({
        ...prevTask,
        error: error,
      }));
    }

    return error === "";
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (isValid()) {
      onAdd(newTask);
      setNewTask({ taskName: "", deadline: "", error: "" });
    }
  };

  return (
    <div className="center">
      <form onSubmit={handleSubmit}>
        <h3 className="center">Add Tasks here!</h3>
        <input
          name="taskName"
          value={newTask.taskName}
          placeholder="Add New Task"
          onChange={handleChange}
        />
        <input
          name="deadline"
          value={newTask.deadline}
          placeholder="Add deadline"
          onChange={handleChange}
        />
        <div style={{ color: "red", fontSize: 12 }}>{newTask.error}</div>
        <div className="center">
            <button type="submit">
            Add Task
            </button>
        </div>
      </form>
    </div>
  );
};

export default AddTask;
