const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const httpStatus = require("http-status");

// Mendapatkan daftar semua pengguna
const getUsers = async (req, res) => {
  const { query } = req;
  try {
    const users = await User.find({...query});
    const data = [];
    users.map((x) =>
      data.push({
        key: x._id,
        id: x._id,
        username: x.username,
        email: x.email,
        role: x.role,
      })
    );
    res.status(httpStatus.OK).json({
      status: httpStatus.OK,
      message: httpStatus[200],
      data,
    });
  } catch (error) {
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
};

// Mendapatkan pengguna berdasarkan ID
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(httpStatus.NOT_FOUND).json({ error: "User not found" });
    }
    res.status(httpStatus.OK).json(user);
  } catch (error) {
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
};

// Membuat pengguna baru
const createUser = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    // Cek apakah pengguna dengan email yang sama sudah ada
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ error: "Email already exists" });
    }

    // Enkripsi password sebelum disimpan
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      username,
      email,
      password: hashedPassword,
      role,
    });

    await user.save();
    res.status(httpStatus.CREATED).json({
      status: httpStatus.OK,
      message: httpStatus[200],
    });
  } catch (error) {
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
};

// Mengubah pengguna
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, password, role } = req.body;

    // Cari pengguna berdasarkan ID
    const user = await User.findById(id);

    // Jika pengguna tidak ditemukan, kirim respons kesalahan
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Enkripsi password sebelum disimpan
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update data pengguna
    user.username = username;
    user.password = hashedPassword;
    user.role = role;

    // Simpan perubahan ke database
    await user.save();

    res.json({ message: "User updated successfully", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Menghapus pengguna
const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(httpStatus.NOT_FOUND).json({ error: "User not found" });
    }
    res.status(httpStatus.OK).json({ message: "User deleted successfully" });
  } catch (error) {
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
