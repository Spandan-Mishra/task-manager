import { useState } from "react";
import PropTypes from 'prop-types';
import '../App.css';

const DeleteTask = ({ onDelete }) => {
    const [id, setId] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");
        if(!token) {
            console.log("Login required!");
            return ;
        }
        try {
            const response = await fetch('http://localhost:3000/todo', {
                method: "DELETE",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token
                },
                body: JSON.stringify({
                    id: id
                })
            });

            if(!response.ok) {
                console.log("Authorization failed");
                return ;
            }

            onDelete();
            setId('');
        } catch(error) {
            console.log(error.message);
        }

    }

    return (
        <form className="box small delete" onSubmit={handleSubmit}>
            <h2 >Delete Tasks here!</h2>
            <div className="form">
                <input 
                    type="text" 
                    placeholder="Enter task id to delete it"
                    value={id}
                    className="input1"
                    onChange={(e) => {
                        setId(e.target.value)
                        }}/>
                <button type="submit">Delete!</button> 
            </div> 

        </form>
    )
}

DeleteTask.propTypes = {
    onDelete: PropTypes.func.isRequired
}

export default DeleteTask;