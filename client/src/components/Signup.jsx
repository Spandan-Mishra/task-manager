import { useState } from "react";

const Signup = ({ apiUrl }) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    return (
        <div className="box large single-day-regular">
            <p>{error}</p>
            <h1>Signup</h1>
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
                        const response = await fetch(`${apiUrl}/signup`, {
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
                        console.log(json);
                        if(response.ok) {
                            setError('');
                            window.location.href = `${apiUrl}/login`
                        } else {
                            setError(json.msg);
                        }
                    }}
                >
                    Signup
                </button> 
            </div>
        </div>
        
    )
}

export default Signup;