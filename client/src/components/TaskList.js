import React from "react";
import "../App.css";
import TaskItem from "./TaskItem";

const TaskList = ({ tasks, onToggle }) => {
  return (
    <div className="center" style={{margin:"30px 0px"}}>
      <table>
        <thead>
          <tr>
            <td>TaskId</td>
            <td>Name</td>
            <td>Deadline</td>
            <td>Status</td>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <TaskItem
              key={task.id}
              id={task.id}
              taskName={task.taskName}
              deadline={task.deadline}
              status={task.status}
              onToggle={onToggle}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TaskList;
