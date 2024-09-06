import React from "react";
import "../App.css";

const TaskItem = ({ id, taskName, deadline, status, onToggle }) => {
  return (
    <tr style={{ textDecoration: status ? "line-through" : "" }}>
      <td>{id}</td>
      <td>{taskName}</td>
      <td>{deadline}</td>
      <td>
        <input
          type="checkbox"
          className="checkbox"
          checked={status}
          onChange={() => onToggle(id)}
        ></input>
      </td>
    </tr>
  );
};

export default TaskItem;
