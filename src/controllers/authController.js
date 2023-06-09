const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Registrasi pengguna baru
const registerUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Cek apakah pengguna dengan email yang sama sudah terdaftar
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Membuat hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Membuat pengguna baru
    const newUser = new User({
      email,
      password: hashedPassword,
    });

    // Menyimpan pengguna ke database
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// Login pengguna
const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Cek apakah pengguna dengan username yang diberikan ada di database
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    // Membandingkan password yang diberikan dengan password yang ada di database
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    // Membuat token JWT
    const token = jwt.sign(
      { userId: user._id, username: user.username, email: user.email },
      process.env.JWT_SECRET,
      {
        expiresIn: "24h",
      }
    );

    const data = {
      token,
      username: user.username,
      role: user.role,
    }

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = {
  registerUser,
  loginUser,
};
