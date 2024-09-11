import { useEffect, useState } from "react";
import AddTask from "./AddTask";
import "../App.css";
import deleteIcon from '../assets/delete-icon.png'

const Todo = () => {
    const [todos, setTodos] = useState([]);
    const [error, setError] = useState("");

    const fetchData = async () => {
        const token = localStorage.getItem("token");
        if(!token) {
            setError("Login required!");
            return ;
        }
        try {
            const response = await fetch('http://localhost:3000/todo', {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token
                },
            });

            if(!response.ok) {
                setError("Authorization failed");
                return ;
            }

            const json = await response.json();
            setTodos(json);
        } catch(error) {
            setError(error.message);
        }
    }
    
    const handleDelete = async (id) => {
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

            fetchData();
        } catch(error) {
            console.log(error.message);
        }

    }

    useEffect(() => {
        fetchData();
    }, [])

    return (
        <div className="center single-day-regular">
            {error ? (
                <h2>{error}</h2>
            ) : (
                <>
                    {todos.length !== 0  ? (
                        <div className="tasks">
                            <table>
                                    <thead>
                                        <tr>
                                            <th>Id</th>
                                            <th>Task</th>
                                            <th>Status</th>
                                            <th>Delete</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {todos.map((todo, index) => (
                                            <tr key={index}>
                                                <th>{todo.id}</th>
                                                <th className="todo-content">{todo.todo}</th>
                                                <th><input 
                                                    type="checkbox" 
                                                    checked={todo.status}
                                                    className="checkbox"
                                                    onChange={async () => {
                                                        await fetch('http://localhost:3000/todo',{
                                                            method: "PUT",
                                                            headers: {
                                                                'Content-Type': 'application/json',
                                                                'Authorization': localStorage.getItem("token")
                                                            },
                                                            body: JSON.stringify({
                                                                id: todo.id
                                                            }),
                                                        });
                                                        fetchData();
                                                    }}
                                                    />
                                                </th>
                                                <th >
                                                    <img  onClick={() => handleDelete(todo.id)} className="delete" src={deleteIcon}></img>
                                                </th>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            
                        </div>
                    ) : (
                        <h2 style={{ paddingLeft: "65%", paddingTop: "15%" }}>Add Tasks!</h2>
                    )}     
                    <div className="horizontal">       
                        <AddTask onAddTask={fetchData}/>
                    </div>
                </>
        )}
        </div>
    )
}

export default Todo;