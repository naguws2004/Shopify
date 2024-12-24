// common.js
const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const db = require('./db');

// Create a new user
const createUser = async (req, res) => {
  const { name, email, password } = req.body;
  const saltRounds = 10;
  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const query = 'INSERT INTO users (name, email, hashed_password) VALUES (?, ?, ?)';
    const params = [name, email, hashedPassword];
    await db.query(query, params);
    res.status(201).send('User registered successfully');
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update a user
const updateUser = async (req, res) => {
  const { name } = req.body;
  const { id } = req.params;
  try {
    const query = 'UPDATE users SET name = ? WHERE id = ?';
    const params = [name, id];
    const [result] = await db.query(query, params);
    if (result.affectedRows > 0) {
      res.json({ message: 'User updated' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update a user password
const updateUserPassword = async (req, res) => {
  const { name, password } = req.body;
  const { id } = req.params;
  const saltRounds = 10;
  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const query = 'UPDATE users SET name = ?, hashed_password = ? WHERE id = ?';
    const params = [name, hashedPassword, id];
    const [result] = await db.query(query, params);
    if (result.affectedRows > 0) {
      res.json({ message: 'User updated' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get user by id
const getUserById = async (req, res) => {
  try {
    const query = 'SELECT id, name, email FROM users WHERE id = ?';
    const params = [req.params.id];
    const [rows] = await db.query(query, params);
    if (rows.length > 0) {
      res.status(200).json(rows[0]);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createUser,
  updateUser,
  updateUserPassword,
  getUserById
};