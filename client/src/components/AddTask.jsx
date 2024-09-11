import { useState } from "react";
import PropTypes from 'prop-types';
import "../App.css"

const AddTask = ({ onAddTask }) => {
    const [todo, setTodo] = useState("")
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");
        if(!token) {
            setError("Login required!");
            return ;
        }
        try {
            const response = await fetch('http://localhost:3000/todo', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token
                },
                body: JSON.stringify({
                    todo: todo
                })
            });

            if(!response.ok) {
                setError("Authorization failed");
                return ;
            }

            onAddTask();
            setTodo('');
        } catch(error) {
            console.log(error.message);
        }

    }

    return (
        <form className="box small single-day-regular" onSubmit={handleSubmit}> 
            <h2 >Add Tasks here!</h2>
            <p>{error}</p>
            <div className="form">
                <input 
                    type="text" 
                    placeholder="Enter task to add"
                    value={todo}
                    className="input1"
                    onChange={(e) => {
                        setTodo(e.target.value)
                        }}/>
                <button type="submit">Add!</button> 
            </div> 

        </form>
    )
}

AddTask.propTypes = {
    onAddTask: PropTypes.func.isRequired,
};

export default AddTask;