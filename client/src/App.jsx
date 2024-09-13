// import { useState } from 'react'
import { BrowserRouter , Routes , Route } from "react-router-dom";
const apiUrl = import.meta.env.VITE_APP_API_URL;

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
        <Route path="/" element={<Login apiUrl={apiUrl}/>} />
        <Route path="/login" element={<Login apiUrl={apiUrl} />} />
        <Route path="/signup" element={<Signup apiUrl={apiUrl}/>} />
        <Route path="/todo" element={<Todo apiUrl={apiUrl}/>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
