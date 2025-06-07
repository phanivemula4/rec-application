import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import axios from 'axios';
import './Chat.css';


const socket = io("http://localhost:1188", {
  withCredentials: true,
});

const Chat = ({ senderEmail, receiverEmail }) => {
  const [msg, setMsg] = useState("");
  const [inphoto, setInphoto] = useState(null);
  const [extractedmsgs, setExtractedmsgs] = useState([]);

  const savephoto = (e) => {
    setInphoto(e.target.files[0] || null);
  };
  useEffect(() => {
  console.log("Sender:", senderEmail);
  console.log("Receiver:", receiverEmail);
}, [senderEmail, receiverEmail]);

  useEffect(() => {
    if (senderEmail) {
      socket.emit('join', senderEmail);
    }

    if (senderEmail && receiverEmail) {
      socket.emit('allmessages', { sender: senderEmail, receiver: receiverEmail });
    }

    socket.on("connect", () => {
      console.log("Connected to socket server:", socket.id);
    });

    socket.on('allmessages_response', (msgs) => {
      setExtractedmsgs(msgs);
    });

    socket.on('new_message', (newmsg) => {
      setExtractedmsgs((prevMsgs) => [...prevMsgs, newmsg]);
    });

    return () => {
      socket.off('allmessages_response');
      socket.off('new_message');
    };
  }, [senderEmail, receiverEmail]);

  // const sendphoto = async (e) => {
  //   e.preventDefault();

  //   if (!inphoto) return;

  //   try {
  //     const formdata = new FormData();
  //     formdata.append('photo', inphoto);
  //     formdata.append('sender', senderEmail);
  //     formdata.append('receiver', receiverEmail);

  //     await axios.post('http://localhost:1188/personalphotos', formdata, {
  //       withCredentials: true,
  //       headers: { 'Content-Type': 'multipart/form-data' },
  //     });

  //     setInphoto(null); 
  //   } catch (error) {
  //     console.log("Error sending photo:", error);
  //   }
  // };

  // const messagego = async(e) => {
  //   e.preventDefault();
  //   if (!msg.trim()) return;
  //   if(inphoto == null && msg == null){
  //     return;
  //   }
  //   else if(msg == null && inphoto != null){
  //        try {
  //     const formdata = new FormData();
  //     formdata.append('photo', inphoto);
  //     formdata.append('sender', senderEmail);
  //     formdata.append('receiver', receiverEmail);
  //     formdata.append('context',msg)
  //     await axios.post('http://localhost:1188/personalphotos', formdata, {
  //       withCredentials: true,
  //       headers: { 'Content-Type': 'multipart/form-data' },
  //     });

  //     setInphoto(null); 
  //   } catch (error) {
  //     console.log("Error sending photo:", error);
  //   }
  //   return;
  //   }else if(inphoto == null && msg != null){
  //     socket.emit('messagedata', {
  //     sender: senderEmail,
  //     receiver: receiverEmail,
  //     context: msg,
  //     image:inphoto,
  //   });

  //   setMsg(""); 
  //   return;
  //   }
  //   else if(msg != null && inphoto != null){
  //         try {
  //     const formdata = new FormData();
  //     formdata.append('photo', inphoto);
  //     formdata.append('sender', senderEmail);
  //     formdata.append('receiver', receiverEmail);
  //     formdata.append('context',msg)
  //     await axios.post('http://localhost:1188/personalphotos', formdata, {
  //       withCredentials: true,
  //       headers: { 'Content-Type': 'multipart/form-data' },
  //     });

  //     setInphoto(null); 
  //   } catch (error) {
  //     console.log("Error sending photo:", error);
  //   }
  //   return;
  //   }
  //   }
  // };
const messagego = async (e) => {
  e.preventDefault();

  const trimmedMsg = msg.trim();

  // If there's only text
  if (inphoto == null && trimmedMsg !== "") {
    socket.emit('messagedata', {
      sender: senderEmail,
      receiver: receiverEmail,
      context: trimmedMsg,
      image: null,
    });
    setMsg("");
    return;
  }

  // If there's an image (with or without text)
  if (inphoto) {
    try {
      const formdata = new FormData();
      formdata.append('photo', inphoto);
      formdata.append('sender', senderEmail);
      formdata.append('receiver', receiverEmail);
      formdata.append('context', trimmedMsg); // safe even if empty

      await axios.post('http://localhost:1188/personalphotos', formdata, {
        withCredentials: true,
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setInphoto(null);
      setMsg("");
    } catch (error) {
      console.log("Error sending photo:", error);
    }
    return;
  }

  // If there's neither photo nor message
  if (!trimmedMsg && !inphoto) {
    return;
  }
};

  return (
    <div className="chat-container">
      <h2 className="chat-header">Chat</h2>
      <p><strong>Sender:</strong> {senderEmail}</p>
      <p><strong>Receiver:</strong> {receiverEmail}</p>

      <div className="chat-messages">
        {extractedmsgs.length === 0 ? (
          <p className="chat-no-messages">No messages yet.</p>
        ) : (
          <ul className="chat-message-list">
            {extractedmsgs.map((m, index) => (
              <li key={index} className="chat-message-item">
                <strong>{m.sender}:</strong>
                {m.context && <p>{m.context}</p>}
                {m.image && (
                  <img
                    src={`http://localhost:1188/${m.image}`}
                    alt="sent"
                    style={{ maxWidth: "100%", borderRadius: "5px", marginTop: "5px" }}
                  />
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      <form onSubmit={messagego} className="chat-form">
        <input
          type="text"
          value={msg}
          onChange={e => setMsg(e.target.value || null)}
          placeholder="Enter your message"
          className="chat-input-text"
        />    
        <input type="file" onChange={savephoto} className="chat-input-file" />
        <button type="submit" className="chat-submit-button">Send Image</button>
      </form>
    </div>
  );
};

export default Chat;
