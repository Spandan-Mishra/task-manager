const express = require('express');
const app = express();
const PORT = 3000;
var jwt = require("jsonwebtoken");
const { auth, JWT_SECRET } = require("./auth");
const bcrypt = require('bcrypt');
require('dotenv').config({ path: '../.env' });
app.use(express.json());
const cors = require("cors");
app.use(cors());
const { z } = require('zod');
const mongoose = require('mongoose');
const { UserModel, TodoModel, MONGO_LINK } = require('./db');

const userSchema = z.object({
  email: z.string().min(10).max(30).email(),
  password: z.string().min(8).max(30)
})

mongoose.connect(MONGO_LINK);

app.post('/signup', async (req, res) => {
  try{
      const parsedData = userSchema.safeParse(req.body);

      if(!parsedData.success) {
        res.status(400).json({message: "Incorrect format"});
        return 
      }

      const email = req.body.email;
      const password = req.body.password;
      const name = req.body.name;

      const hashedPassword = await bcrypt.hash(password, 5);

      await UserModel.create({
        email: email,
        password: hashedPassword,
        name: name
      })

      res.status(200).json({
        message: "Signed up successfully"
      })
  } catch(e) {
    res.status(500).json({
      message: "Error while signing up"
    })
  }
})

app.post('/login', async (req,res) => {
    const parsedData = userSchema.safeParse(req.body);

    if(!parsedData.success) {
      res.status(400).json({
        message: "Incorrect format"
      })
      return
    }

    const email = req.body.email;
    const password = req.body.password;

    const user = await UserModel.findOne({
      email: email
    })

    if(!user) {
      res.status(400).json({
        message: "User doesn't exist"
      })
      return 
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if(user && passwordMatch) {
      const token = jwt.sign({
        id: user._id.toString()
      }, JWT_SECRET)

      res.json({token});
    } else {
      res.status(403).json({
        message: "Invalid credentials"
      })
    }

    
})

app.get('/todo', auth, async (req, res) => {
  const userId = req.userId;

  const todos = await TodoModel.find({
    userId
  })

  res.status(200).json({
    todos
  })
})

app.post('/todo', auth, async (req, res) => {
  const userId = req.userId;
  const title = req.body.title;
  
  await TodoModel.create({
    userId,
    title,
    status: false
  })

  res.status(200).json({
    message: "Todo created successfully"
  }) 
})

app.put('/todo', auth, async (req, res) => {
  try {
    const todoId = req.body.todoId;
    
    const todo = await TodoModel.findById(todoId);

    todo.status = !todo.status;

    await todo.save();

    res.status(200).json({
      message: "Todo updated successfully"
    })
  } catch(e) {
    res.status(500).json({
      message: "Error while updating"
    })
  }
})

app.delete('/todo', auth, async (req, res) => {
  try {
      const todoId = req.body.todoId;

      await TodoModel.findByIdAndDelete(todoId);
      res.status(200).json({
        message: "Todo successfully deleted"
      })
  } catch(e) {
    res.status(500).json({
      message: "Error while deleting"
    })
  }
})

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});

module.exports = app;