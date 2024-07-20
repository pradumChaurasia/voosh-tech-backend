const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { OAuth2Client } = require('google-auth-library');
const Task = require('../models/Task');


const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

exports.googleLogin = async (req, res) => {
    const { tokenId } = req.body;

    try {
        const ticket = await client.verifyIdToken({
            idToken: tokenId,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        const { sub, email, name } = payload;

        let user = await User.findOne({ email });
        if (!user) {
            user = new User({
                googleId: sub,
                email,
                name,
            });
            await user.save();
        }

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
            expiresIn: '1h',
        });

        // res.status(200).json({ token });
        res.status(200).json({
            token,
            user: {
                name: user.name,
                email: user.email,
            },
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.register = async (req, res) => {
    try {
        const { email, password, name } = req.body;

        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        user = new User({
            email,
            password,
            name,
        });

        await user.save();

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
            expiresIn: '24h',
        });

        // res.status(201).json({ token });
        res.status(201).json({
            token,
            user: {
                name: user.name,
                email: user.email,
            },
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
            expiresIn: '24h',
        });

        // res.status(200).json({ token });
        res.status(200).json({
            token,
            user: {
                name: user.name,
                email: user.email,
            },
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};


exports.createTask = async (req, res) => {
    const { title, description, status } = req.body;
    try {
        const task = new Task({
            title,
            description,
            status,
            userId: req.user.id,
        });

        await task.save();
        res.status(201).json(task);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
}

exports.getTasks = async (req, res) => {
    try {
        const tasks = await Task.find({ userId: req.user.id });
        res.json(tasks);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
}

exports.updateTask = async (req, res) => {
    const { title, description, status } = req.body;

    try {
        let task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({ msg: 'Task not found' });
        }

        // Make sure user owns task
        if (task.userId.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        task = await Task.findByIdAndUpdate(
            req.params.id,
            { $set: { title, description, status } },
            { new: true }
        );

        res.json(task);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
}

exports.deleteTask = async(req,res)=>{
    try {
        let task = await Task.findById(req.params.id);
    
        if (!task) {
          return res.status(404).json({ msg: 'Task not found' });
        }
    
        if (task.userId.toString() !== req.user.id) {
          return res.status(401).json({ msg: 'Not authorized' });
        }
    
        await Task.findByIdAndDelete(req.params.id);
    
        res.json({ msg: 'Task removed' });
      } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
      }
}