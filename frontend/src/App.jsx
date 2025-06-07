import React from 'react'
import { Route, Routes } from 'react-router-dom'; 
import './App.css'
import Register from './assets/Register'
import Home from './assets/Home';
import Login from './assets/Login';
import Dashboard from './assets/Dashboard';
import Door from './assets/Door';
import Chat from './assets/Chat';
import Account from './assets/Account';
const App = () => {
  return (    
    <div>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/reg" element={<Register/>}/>
        <Route path="/log" element={<Login/>}/>
        <Route path="/ldas" element={<Dashboard/>}/>
        <Route path="/dor" element={<Door/>}/>
        <Route path="/chat" element={<Chat/>}/>
        <Route path="/acc" element={<Account/>}/>
      </Routes>
    </div>
  )
}

export default App
