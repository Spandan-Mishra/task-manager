const path = require('path');
const fs = require('fs');
const express = require('express');
const app = express();
const PORT = 3000;
var jwt = require("jsonwebtoken");
const { auth } = require("./middleware");
var sha256 = require('js-sha256');
const JWT_SECRET = "secret";
const bodyParser = require("body-parser");
var jsonParser = bodyParser.json();
var urlencodedParser = bodyParser.urlencoded({ extended: false });
const cors = require("cors");
app.use(cors());
app.use(jsonParser);
let currentUser = "";

app.post('/signup', (req, res) => {
  const filePath = path.join(__dirname, 'todos.json');
  const username = req.body.username;
  const password = req.body.password;

  if(!username || !password) {
    return res.status(400).json({msg: "Enter username and password"});
  }

  fs.readFile(filePath, 'utf-8', (err, data) => {
    if(err) {
        return res.status(400).json({msg: "Error reading the file"})
    }

    const todos = JSON.parse(data);
    currentUser = username;
    if(todos.database.some((user) => user.username === username)) {
        return res.status(403).json({msg: "User already exists"});
    } else {
        var hash = sha256(password)

        const newUser = {
            "username": username,
            "id": todos.database.length+1,
            "password": hash,
            "todos": []
        }
        todos.database.push(newUser);

        fs.writeFile(filePath, JSON.stringify(todos, null, 2), 'utf-8', (err, data) => {
            if(err) {
                return res.status(400).json({msg: "Error writing the file"})
            }
        })

        return res.status(200).json({msg: "User registered successfully!"});
    }
  })
})

app.post('/login', (req,res) => {
    const filePath = path.join(__dirname, 'todos.json');
    const username = req.body.username;
    const password = req.body.password;
    
    if(!username || !password) {
        return res.status(400).json({msg: "Enter username and password"});
    }

    fs.readFile(filePath, 'utf-8', (err, data) => {
        if(err) {
            return res.status(400).json({msg: "Error reading the file"});
        }

        const todos = JSON.parse(data);
        var hash = sha256(password)

        if(todos.database.some((user) => user.username === username && user.password === hash)) {
            currentUser = username;
            const token = jwt.sign({
                id: todos.database.filter((user) => user.username === username)[0].id
            }, JWT_SECRET);

            return res.status(200).json({ 
                token, 
                client:{msg:"User logged in successfully"}
            });
        } else {
            return res.status(403).json({msg: "Invalid credentials"});
        }
    })
})

app.get('/todo', auth, (req, res) => {
    const filePath = path.join(__dirname, 'todos.json');
    
    fs.readFile(filePath, 'utf-8', (err, data) => {
        if(err) {
            return res.status(400).json({msg: "Error reading the file"});
        }

        const todos = JSON.parse(data);
        return res.status(200).json(todos.database.filter((user) => user.username === currentUser)[0].todos);
    })
})

app.post('/todo', auth, (req, res) => {
    const filePath = path.join(__dirname, 'todos.json');
    const todo = req.body.todo;

    if(!todo) {
        return res.status(400).json({msg: "Enter todo to add"});
    }

    fs.readFile(filePath, 'utf-8', (err, data) => {
        if(err) {
            return res.status(400).json({msg: "Error occured"});
        }

        const todos = JSON.parse(data);
        let currentUserData = todos.database.filter((user) => user.username === currentUser)[0]; 
        const newTodo = {
            id: currentUserData.todos.length + 1,
            todo: todo,
            status: false
        } 

        currentUserData.todos.push(newTodo);
        todos.database.map((user) => 
            user.username === currentUser ? currentUserData : user
        )
        
        const updatedTodos = JSON.stringify(todos, null, 2);

        fs.writeFile(filePath, updatedTodos, 'utf-8', (err) => {
            if(err) {
                res.status(404).json({msg: "Error occured"});
            } else {
                res.status(200).json({client:{msg: "Todo added successfully!"}, todos:updatedTodos});
            }
        })
    })
})

app.put('/todo', auth, (req, res) => {
    const filePath = path.join(__dirname, 'todos.json');
    const todoId = req.body.id;

    if(!todoId) {
        return res.status(400).json({msg: "Enter todo id to mark as complete"});
    }
    
    fs.readFile(filePath, 'utf-8', (err, data) => {
        if(err) {
            return res.status(400).json({msg: "Error occured"});
        }

        const todos = JSON.parse(data);
        let currentUserData = todos.database.filter((user) => user.username === currentUser)[0];
        if(!currentUserData) {
            return res.status(400).json({msg: "No user found"});
        }
        if(todoId > currentUserData.todos.length) {
            return res.status(400).json({msg: "Enter Valid Todo ID"});
        }

        let currentUserTodos = currentUserData.todos.map((todo) => 
            todo.id === Number(todoId) ? { ...todo, status: !todo.status  } : todo
        )

        currentUserData.todos = currentUserTodos;

        todos.database.map((user) => 
            user.username === currentUser ? currentUserData : user
        )

        const updatedTodos = JSON.stringify(todos, null, 2);

        fs.writeFile(filePath, updatedTodos, 'utf-8', (err) => {
            if(err) {
                res.status(400).json({msg: "Error occured"});
            } else {
                res.status(200).json({client:{msg: "Todo updated successfully"}, todos:updatedTodos});
            }
        })       
    })
})

app.delete('/todo', auth, (req, res) => {
    const filePath = path.join(__dirname, 'todos.json');
    const todoId = req.body.id;

    if(!todoId) {
        return res.status(400).json({msg: "Enter todo id to delete"});
    }

    fs.readFile(filePath, 'utf-8', (err, data) => {
        if(err) {
            return res.status(401).json({msg: "Error occured"});
        }

        const todos = JSON.parse(data);
        let currentUserData = todos.database.filter((user) => user.username === currentUser)[0];
        
        if(!currentUserData) {
            return res.status(400).json({msg: "No user found"});
        }

        if(todoId > currentUserData.todos.length) {
            return res.status(400).json({msg: "Enter Valid Todo ID"});
        }

        let currentUserTodos = currentUserData.todos.filter((todo) => todo.id !== Number(todoId));
        currentUserTodos = currentUserTodos.map((todo, index) => ({...todo, id: index + 1}));
        currentUserData.todos = currentUserTodos;

        todos.database.map((user) => user.username === currentUser ? currentUserData : user);

        const updatedTodos = JSON.stringify(todos, null, 2); 

        fs.writeFile(filePath, updatedTodos, 'utf-8', (err) => {
            if(err) {
                res.status(400).json({msg: "Error occured"});
            } else {
                res.status(200).json({client:{msg: "Task Deleted successfully"}, todos:updatedTodos});
            }
        })
    })
})

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});