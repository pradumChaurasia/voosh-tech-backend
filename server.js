const express = require('express');
const dotenv = require('dotenv');
const passport = require('passport');
const session = require('express-session');
const connectDB = require('./config/db');
const http = require('http');
const authRoutes = require('./routes/user.js'); 
const taskRoutes = require('./routes/task.js');
const cors = require('cors')

const router = express.Router();
const app = express();
dotenv.config();


// Connect to database
connectDB();
// app.use(cors())
app.use(cors({
    origin: 'http://localhost:3001',  // Your frontend's URL
    credentials: true
}));
app.use(express.json());
app.use(session({ secret: 'secret', resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

const PORT = process.env.PORT || 3000;



app.use("/api/", authRoutes);
app.use("/api/user/", taskRoutes);

const server = http.createServer(app);
server.listen(PORT, () => {
  console.log(`Server is live on http://localhost:${PORT}`);
});



// xkwFOeGKwaFz6Mhh pradum19441
// npm install mongodb
// mongodb+srv://pradum19441:xkwFOeGKwaFz6Mhh@cluster0.kutx15j.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0