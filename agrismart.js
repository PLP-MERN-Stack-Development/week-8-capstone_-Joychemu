// === AgriSmart MERN App Full Structure ===

// 1. Backend (server/index.js)
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const userRoutes = require('./routes/userRoutes');

const app = express();
dotenv.config();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

app.use('/api/users', userRoutes);

app.get('/', (req, res) => {
  res.send('AgriSmart API is running');
});

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('MongoDB connected');
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}).catch(err => console.log(err));

// 2. Backend (server/models/User.js)
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['farmer', 'agronomist', 'admin'], default: 'farmer' }
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);

// 3. Backend (server/routes/userRoutes.js)
const express = require('express');
const router = express.Router();
const { registerUser, getUsers } = require('../controllers/userController');

router.post('/register', registerUser);
router.get('/', getUsers);

module.exports = router;

// 4. Backend (server/controllers/userController.js)
const User = require('../models/User');

const registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    const user = await User.create({ name, email, password, role });
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { registerUser, getUsers };

// 5. Frontend (client/src/App.js)
import React from 'react';

function App() {
  return (
    <div className="p-6 text-center">
      <h1 className="text-2xl font-bold">Welcome to AgriSmart</h1>
      <p className="mt-4">Transforming Agriculture Through Innovation</p>
    </div>
  );
}

export default App;

// 6. Frontend (client/tailwind.config.js)
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
};

// 7. .env (create in root of server folder)
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/agrismart?retryWrites=true&w=majority

// 8. Project Setup Commands
// - npx create-react-app client
// - npm init -y (in server)
// - npm install express mongoose cors dotenv
// - npm install --save-dev nodemon
// - Add "dev": "nodemon index.js" to server/package.json scripts

// Folder Structure (server):
// ├── controllers
// │   └── userController.js
// ├── models
// │   └── User.js
// ├── routes
// │   └── userRoutes.js
// ├── index.js
// └── .env

// Would you like to continue with crop models and advisory modules next?
