import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Account.css';


const Account = () => {
  const [photo, setphoto] = useState(null);
  const [access, setaccess] = useState('');
  const [prphotos, setprphotos] = useState([]);

  const savefilename = (e) => {
    setphoto(e.target.files[0]);
  };

  const saveaccess = (e) => {
    setaccess(e.target.value);
  };

  const fetchphotos = async () => {
    try {
      const data = await axios.get(`https://rec-application.onrender.com/privatephotos`, { withCredentials: true });
      setprphotos(data.data.photos);
    } catch (error) {
      console.log(error);
    }
  };

  const deletePost = async (post) => {
    try {
      // post.preventDefault()
      await axios.delete('https://rec-application.onrender.com/deletepost', {
        data: { address : post.address,
          sender : post.sender,
          access : post.access,
         },
        withCredentials: true,
      });
    setprphotos((prev) => prev.filter((img) => img.address !== post.address));
    } catch (error) {
      console.log(error);
    }
  };

  const fileuppload = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('photo', photo);
      formData.append('access', access);

      await axios.post('http://localhost:1188/acc', formData, {
        withCredentials: true,
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      fetchphotos(); // refresh photo list
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchphotos();
    // deletePost(post); // load private photos on mount
  }, []);

  return (
  <div className="account-container">
    <h1>Posts</h1>
    <form className="account-form" onSubmit={fileuppload}>
      <label>
        Select access:
        <select value={access} onChange={saveaccess}>
          <option value="">--Select access--</option>
          <option value="private">Private</option>
          <option value="public">Public</option>
        </select>
      </label>

      <label>
        Upload post here:
        <input type="file" onChange={savefilename} />
      </label>

      <button type="submit">Upload</button>
    </form>

    {prphotos.length === 0 ? (
      <h1 className="no-posts-message">No posts available</h1>
    ) : (
      <div className="photos-list">
        {prphotos.map((m, index) => (
          <div key={index} className="photo-item">
            <img
              src={`http://localhost:1188/${m.address}`}
              alt="not available"
            />
            <button className="delete-btn" onClick={() => deletePost(m)}>×</button>
          </div>
        ))}
      </div>
    )}
  </div>
);

};

export default Account;
