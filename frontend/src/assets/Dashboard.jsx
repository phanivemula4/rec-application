import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Chat from './Chat';
import './Dashboard.css';
const Dashboard = () => {
  const [email, setEmail] = useState("");
  const [emails, setEmails] = useState([]);
  const [friendselected, setselectedfriend] = useState("");
  
  const fetchData = async () => {
    try {
      const response = await axios.get('https://rec-application.onrender.com/ldas', { withCredentials: true });
      setEmail(response.data.email);
      setEmails(response.data.emails);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const selectedfriend = (mail) => {
    setselectedfriend(mail);
  };

  return (
   <div  className="dashboard-container">
  <h1 className="dashboard-heading">Hello {email}</h1>

      <div className="friends-list">
        {emails.length > 0 ? (
          emails.map((mail) => (
            <button
              key={mail}
              className={`friend-button ${friendselected === mail ? "active" : ""}`}
              onClick={() => selectedfriend(mail)}
            >
              {mail}
            </button>
          ))
        ) : (
          <p className="no-users">No users available.</p>
        )}
      </div>

      {friendselected && (
        <div className="chat-section">
          <Chat senderEmail={email} receiverEmail={friendselected} />
        </div>
      )}
    </div>
  );
};

export default Dashboard;
