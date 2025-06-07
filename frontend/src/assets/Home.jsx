import React from 'react'
import { Link } from 'react-router-dom'
import Register from './Register'
import Login from './Login'
import './Home.css';
const Home = () => {
  return (
    <div className="home-container">
            <h1 className="home-title">Welcome</h1>
      <div className="home-links">
      <Link to = '/reg'><h1 className="home-button">Signup</h1></Link>
      <Link to = '/log'><h1 className="home-button">Login</h1></Link>
            </div>

    </div>
  )
}

export default Home
