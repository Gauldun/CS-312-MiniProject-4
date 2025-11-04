const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const cors = require("cors");

const app = express();
const PORT = 8000;

// Holds users data in an array
let users = [
  { 
    user_id: "testuser", 
    password: "password123", 
    name: "Test User",
    age: 30,
    occupation: "Tester",
    city: "Testville"
  }
];

let posts = [
  {
    id: 1,
    author_id: "testuser",
    title: "WRONG!WRONG!WRONG!",
    body: "Zig is better than Rust! Everyone else is WRONG!",
    timestamp: new Date().toISOString()
  },
  {
    id: 2,
    author_id: "some_user",
    title: "I hate javascript.",
    body: "Ya know guys, maybe it's time we get rid of javascript for good.",
    timestamp: new Date().toISOString()
  }
];
let lastPostId = 2;

// Middleware

app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));

// Handles browser requests for a tab icon
app.get('/favicon.ico', (req, res) => res.status(204).end());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Enable sessions to keep track of logged-in users
app.use(session({
  secret: "a-very-secret-key-for-cs312",
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    maxAge: 1000 * 60 * 60 * 24
  }
}));

// Custom middleware to check if user is authenticated
const isAuthenticated = (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    res.status(401).json({ message: "You are not authorized." });
  }
};

// POST for signup
app.post("/api/signup", (req, res) => {
  const { user_id, password, name, age, occupation, city } = req.body;

  // Check if user already exists
  if (users.find(u => u.user_id === user_id)) {
    return res.status(400).json({ message: "Username already exists." });
  }

  // Create new user object
  const newUser = {
    user_id,
    password,
    name,
    age,
    occupation,
    city
  };

  users.push(newUser);
  console.log("New user signed up:", newUser);
  res.status(201).json({ message: "User created successfully!" });
});

// POST for signin
app.post("/api/signin", (req, res) => {
  const { user_id, password } = req.body;

  const user = users.find(u => u.user_id === user_id);

  if (!user || user.password !== password) {
    return res.status(401).json({ message: "Invalid username or password." });
  }

  // In session user data storage
  const userSessionData = { ...user };
  delete userSessionData.password;
  
  req.session.user = userSessionData;
  console.log("User logged in:", userSessionData);
  res.status(200).json({ message: "Login successful!", user: userSessionData });
});

// GET for logout
app.get("/api/logout", (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).json({ message: "Could not log out." });
    }
    res.clearCookie('connect.sid');
    res.status(200).json({ message: "Logout successful." });
  });
});

// GET for check-auth
app.get("/api/check-auth", (req, res) => {
  if (req.session.user) {
    res.status(200).json({ isAuthenticated: true, user: req.session.user });
  } else {
    res.status(200).json({ isAuthenticated: false, user: null });
  }
});

// GET for blogs
app.get("/api/blogs", (req, res) => {
  const sortedPosts = [...posts].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  res.status(200).json(sortedPosts);
});

// GET for blogs/:id
app.get("/api/blogs/:id", (req, res) => {
  const postId = parseInt(req.params.id);
  const post = posts.find(p => p.id === postId);

  if (!post) {
    return res.status(404).json({ message: "Post not found." });
  }
  res.status(200).json(post);
});

// POST for blogs
app.post("/api/blogs", isAuthenticated, (req, res) => {
  const { title, body } = req.body;
  
  if (!title || !body) {
    return res.status(400).json({ message: "Title and body are required." });
  }

  const newPost = {
    id: ++lastPostId,
    author_id: req.session.user.user_id,
    title,
    body,
    timestamp: new Date().toISOString()
  };

  posts.push(newPost);
  console.log("New post created:", newPost);
  res.status(201).json(newPost);
});

// PUT for blogs/:id
app.put("/api/blogs/:id", isAuthenticated, (req, res) => {
  const postId = parseInt(req.params.id);
  const { title, body } = req.body;

  const postIndex = posts.findIndex(p => p.id === postId);

  if (postIndex === -1) {
    return res.status(404).json({ message: "Post not found." });
  }

  if (posts[postIndex].author_id !== req.session.user.user_id) {
    return res.status(403).json({ message: "You can only edit your own posts." });
  }
  
  posts[postIndex] = { ...posts[postIndex], title, body, timestamp: new Date().toISOString() };
  
  console.log("Post updated:", posts[postIndex]);
  res.status(200).json(posts[postIndex]);
});

// DELETE for blogs/:id
app.delete("/api/blogs/:id", isAuthenticated, (req, res) => {
  const postId = parseInt(req.params.id);

  const postIndex = posts.findIndex(p => p.id === postId);

  if (postIndex === -1) {
    return res.status(404).json({ message: "Post not found." });
  }

  if (posts[postIndex].author_id !== req.session.user.user_id) {
    return res.status(403).json({ message: "You can only delete your own posts." });
  }

  posts = posts.filter(p => p.id !== postId);
  
  console.log("Post deleted:", postId);
  res.status(200).json({ message: "Post deleted successfully." });
});

app.get("/api/profile", isAuthenticated, (req, res) => {
  const user = req.session.user;

  const userPosts = posts
    .filter(p => p.author_id === user.user_id)
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  
  res.status(200).json({
    user: user,
    userPosts: userPosts
  });
});


app.listen(PORT, '127.0.0.1', () => {
  console.log(`Backend server is running on http://localhost:${PORT}`);
});
