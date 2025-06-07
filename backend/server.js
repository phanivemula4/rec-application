const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/Users');
const cors = require('cors');
const session = require('express-session');
const multer = require('multer')
const Posts = require('./models/Posts')
const port = 1188;
const Message = require('./models/Message')
const { createServer } = require('http');
const { Server } = require("socket.io");
const app = express();
const server = createServer(app);
const io = new Server(server,{
  cors:{
    origin:"http://localhost:5173",
    methods:["GET","POST"],
    credentials:true
  }
});
dotenv.config();


app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.use(session({
  secret: 'my_session',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }
}));

app.use(express.json());

io.on('connection', (socket) => {
  console.log("Client connected:", socket.id);

  socket.on('join', (email) => {
    socket.join(email);
    console.log(`User joined room: ${email}`);
  });

  socket.on('messagedata', async (data) => {
    try {
      const { sender, receiver, context,image } = data;
      console.log(sender, receiver, context);

      const newmessage = new Message({ sender, receiver, context,image, timestamp: new Date() });
      await newmessage.save();

      io.to(sender).emit('new_message', newmessage);
      io.to(receiver).emit('new_message', newmessage);

    } catch (err) {
      console.error("Error saving message:", err);
    }
  });



  socket.on('allmessages', async ({ sender, receiver }) => {
    try {
      const allMessages = await Message.find({
        $or: [
          { sender, receiver },
          { sender: receiver, receiver: sender }
        ]
      }).sort({ timestamp: 1 }); 

      socket.emit('allmessages_response', allMessages);
    } catch (error) {
      console.error("Error fetching messages:", error);
      socket.emit('allmessages_error', { message: "Failed to load messages" });
    }
  });
});

const storage = multer.diskStorage({
  destination: function(req,file,cd){
    cd(null,'./uploads')
  },
  filename:function(req,file,cd){
    cd(null,`${Date.now()}-${file.originalname}`)
  },
})

const upload = multer({ storage });
app.use('/uploads', express.static('uploads'));

mongoose.connect(process.env.DBID).then(() => {
  console.log("MongoDB connected successfully");
});

app.post('/acc', upload.single('photo'), async (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ error: 'Not in' });
  }
  console.log(req.file, "hi file");
  console.log(req.body.access, "hi body access");

  const { email } = req.session.user;
  res.json({ email });
  console.log("file uploaded by", email);
  const address = req.file.path
  const access = req.body.access
  const newposts = new Posts({
    address,access,sender : email
  }) 
  await newposts.save();
});

app.get('/publicphotos', async (req, res) => {
  try {
    const photos = await Posts.find({ access: 'public' });
    res.json({ photos });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Failed to fetch public photos' });
  }
});

app.get('/privatephotos', async (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ error: 'Not in' });
  }
  const { email } = req.session.user;
  console.log(email)
  try {
    const photos = await Posts.find({ access: 'private',sender:email});
    console.log('posts retrived successfully')
    res.json({ photos });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Failed to fetch public photos' });
  }
});

app.post('/reg', async (req, res) => {
  const { email, password } = req.body;
  try {
    const dead = await User.findOne({ email });
    if (dead) {
      return res.status(400).json({ message: "email already exist" });
    }

    const newUser = new User({ email, password });
    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Registration failed", error: error.message });
  }
});

app.post('/log', async (req, res) => {
  const { email, password } = req.body;
  try {
    const check = await User.findOne({ email });
    if (!check) {
      return res.status(400).json({ message: "email not found" });
    }
    console.log("Entered:", password);
    console.log("From DB:", check.password);
    if (password === check.password) {
      req.session.user = { email: check.email };
      console.log("Session set:", req.session.user);
      return res.status(200).json({ message: "Login successful" });
    } else {
      return res.status(401).json({ message: "Incorrect password" });
    }
  } catch (error) {
    res.status(500).json({ message: "Login failed", error: error.message });
  }
});

app.get('/ldas', async (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ error: 'Not logged in' });
  }

  try {
    const { email } = req.session.user;

    const allUsers = await User.find({}, 'email'); 
    const emails = allUsers.map(user => user.email); 

    res.json({ email, emails });
    console.log(email);
    console.log(emails);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/dor', async (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ error: 'Not logged in' });
  }
  const { email } = req.session.user;
  res.json({ email });
  console.log("user logged", email);
});

app.get('/logo', (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(500).json({ error: 'Logout failed' });
    res.clearCookie('connect.sid'); 
    res.json({ message: 'Logged out successfully' });
  });
});

app.set('io', io)


// app.post('/personalphotos', upload.single('photo'), async (req, res) => {
//   if (!req.session.user) {
//     return res.status(401).json({ error: 'Not in' });
//   }
//   // const { email } = req.session.user;
//   // res.json({ email });
//   console.log("file uploaded by", email);
//   const image = req.file.path
//   const sender = req.body.sender
//   const receiver = req.body.receiver
//   const context = req.body.context
//   const newmessage = new Message({
//     sender,receiver,context,image,timestamp:new Date()
//   }) 
//   await newmessage.save();
//   const io = req.app.get('io');
//   io.to(sender).emit('new_message', {
//       newmessage   
// });

//   io.to(receiver).emit('new_message', {
//   newmessage        
// });

// });

app.post('/personalphotos', upload.single('photo'), async (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ error: 'Not in' });
  }

  const { email } = req.session.user;
  const image = req.file.path;
  const sender = req.body.sender;
  const receiver = req.body.receiver;
  const context = req.body.context;

  const newmessage = new Message({
    sender,
    receiver,
    context,
    image,
    timestamp: new Date()
  });

  await newmessage.save();

  const io = req.app.get('io');
  io.to(sender).emit('new_message', newmessage);
  io.to(receiver).emit('new_message', newmessage);

  // ✅ send the response after all async work is done
  res.json({ success: true });
});

// app.delete('/deletepost',async(req,res)=>{
//   const address = req.body.address;
//   const sender = req.session.user;
//   const post = await User.findByIdAndUpdate(
//     {$pull:{address:{address}}},
//     {sender:{sender}}
//   )
// })
app.delete('/deletepost', async (req, res) => {

  const address = req.body.address;
  const sender = req.body.sender;
  const access = req.body.access;
  console.log('Delete request received with:', { address, access, sender });  
  try {
    const result = await Posts.deleteOne({ address, access ,sender  });
    if (result.deletedCount === 1) {
      res.status(200).json({ message: 'Post deleted' });
    } else {
      res.status(404).json({ message: 'Post not found' });
    }
    console.log('post deleted')
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
    console.log("post not deleted")
  }
});
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});