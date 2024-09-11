import { useState } from "react";

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    return (
        <div className="box large single-day-regular">
            <p>{error}</p>
            <h1>Login</h1>
            <div className="form">
                <input 
                    type="text" 
                    placeholder="Enter username" 
                    name="username" 
                    className="input1"
                    onChange={(e) => {setUsername(e.target.value)}} 
                />    
                <input 
                    type="text" 
                    placeholder="Enter password" 
                    name="password" 
                    className="input2"
                    onChange={(e) => {setPassword(e.target.value)}} 
                />
                <button 
                    type="submit"
                    id="submit"
                    onClick={async () => {
                        const response = await fetch('http://localhost:3000/login', {
                            method: "POST",
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                username: username,
                                password: password
                            }),
                        });
                        
                        const json = await response.json();
                        if(response.ok) {
                            console.log(json.client);
                            localStorage.setItem("token", json.token);
                            setError('');
                            window.location.href = "/todo";
                        } else {
                            console.log(json);
                            setError(json.msg)
                        }
                        
                    }}
                >
                    Login
                </button>
            </div>
        </div>
        
    )
}

export default Login;