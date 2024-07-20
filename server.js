const express = require('express');
const dotenv = require('dotenv');

const connectDB = require('./config/db');
const http = require('http');
const authRoutes = require('./routes/user.js'); 
const taskRoutes = require('./routes/task.js');
const cors = require('cors')
const path = require('path');

const router = express.Router();
const app = express();
dotenv.config();



connectDB();
// app.use(cors())
app.use(cors({
    origin: 'http://localhost:3001', 
    credentials: true
}));
app.use(express.json());


const PORT = process.env.PORT || 3000;



app.use("/api/", authRoutes);
app.use("/api/user/", taskRoutes);

app.use(express.static(path.join(__dirname, 'build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

const server = http.createServer(app);
server.listen(PORT, () => {
  console.log(`Server is live on http://localhost:${PORT}`);
});



// xkwFOeGKwaFz6Mhh pradum19441
// npm install mongodb
// mongodb+srv://pradum19441:xkwFOeGKwaFz6Mhh@cluster0.kutx15j.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0