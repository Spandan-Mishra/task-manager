// import { useState } from 'react'
import { BrowserRouter , Routes , Route } from "react-router-dom";

import Login from './components/Login'
import Signup from './components/Signup'
import Todo from './components/Todo'
import Navbar  from "./constants/Navbar"
import './App.css'

const App = () => {

  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Login/>} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/todo" element={<Todo />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
