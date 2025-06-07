import React from 'react'
import { useState } from 'react'
import axios from 'axios'
import './Register.css';
const Register = () => {
  const [email,setEmail] = useState("")
  const [password,setPassword] = useState("")
  const getemail=(e)=>{
    setEmail(e.target.value)
  }
  const getpassword=(e)=>{
    setPassword(e.target.value)
  }
  const fetchdata=async(e)=>{
    e.preventDefault()
    try {
      const data = await axios.post(`http://localhost:1188/reg`,{email,password})
      console.log(`${email} signup successfull`)
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <div className="register-container">
      <h1 className="register-title">signup</h1>
      <br/>
      <form className="register-form" onSubmit={fetchdata}>
      email : <input type="text" onChange={getemail}></input><br/><br></br>
      password : <input type = "text" onChange={getpassword}></input><br></br>
      <button type='submit'>signup</button>
      </form>
    </div>
  )
}

export default Register
