import { useState } from "react";
import PropTypes from 'prop-types';
import "../App.css"

const AddTask = ({ onAddTask }) => {
    const [todo, setTodo] = useState("")

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");
        if(!token) {
            console.log("Login required!");
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
                console.log("Authorization failed");
                return ;
            }

            onAddTask();
            setTodo('');
        } catch(error) {
            console.log(error.message);
        }

    }

    return (
        <form className="box small" onSubmit={handleSubmit}>
            <h2 >Add Tasks here!</h2>
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