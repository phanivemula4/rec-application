import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Account from './Account';
import './Door.css';


const Door = () => {
  const [uemail, setuemail] = useState("");
  const [puphotos, setpuphotos] = useState([]);
  const navigate = useNavigate();

  const logout = async () => {
    try {
      await axios.get(`https://rec-application.onrender.com/logo`, { withCredentials: true });
      navigate('/');
    } catch (error) {
      console.log(error);
    }
  };

  const fetchdata = async () => {
    try {
      const data = await axios.get(`https://rec-application.onrender.com/dor`, { withCredentials: true });
      setuemail(data.data.email);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchphotos = async () => {
    try {
      const data = await axios.get(`https://rec-application.onrender.com/publicphotos`, { withCredentials: true });
      setpuphotos(data.data.photos); 
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchdata();
    fetchphotos();
  }, []);

  return (
  <div className="door-container">
    <h1>Hello {uemail}</h1>
    <div className="button-group">
      <button onClick={logout} className="door-button">Logout</button>
      <Link to='/ldas'><button className="door-button">Friends</button></Link>
      <Link to='/acc'><button className="door-button">Account</button></Link>
    </div>

    {puphotos.length === 0 ? (
      <h1 className="no-posts-message">No posts available</h1>
    ) : (
      <div className="photos-grid">
        {puphotos.map((m, index) => (
          <img
            key={index}
            src={`https://rec-application.onrender.com/${m.address}`}
            alt="not available"
            className="photo-item"
          />
        ))}
      </div>
    )}
  </div>
);
}

export default Door;
