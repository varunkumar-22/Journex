require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.static(path.join(__dirname, 'public')));

// Get all journals (newest first)
app.get('/api/journals', async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT id, title, content, created_at, updated_at FROM journals ORDER BY created_at DESC'
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch journals' });
  }
});

// Get single journal by id
app.get('/api/journals/:id', async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT id, title, content, created_at, updated_at FROM journals WHERE id = ?',
      [req.params.id]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'Journal not found' });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch journal' });
  }
});

// Create journal
app.post('/api/journals', async (req, res) => {
  const { title, content } = req.body;
  if (!title && !content) {
    return res.status(400).json({ error: 'Title or content is required' });
  }
  try {
    const [result] = await db.query(
      'INSERT INTO journals (title, content) VALUES (?, ?)',
      [title || 'Untitled', content || '']
    );
    const [rows] = await db.query(
      'SELECT id, title, content, created_at, updated_at FROM journals WHERE id = ?',
      [result.insertId]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create journal' });
  }
});

// Update journal
app.put('/api/journals/:id', async (req, res) => {
  const { title, content } = req.body;
  try {
    await db.query(
      'UPDATE journals SET title = ?, content = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [title ?? '', content ?? '', req.params.id]
    );
    const [rows] = await db.query(
      'SELECT id, title, content, created_at, updated_at FROM journals WHERE id = ?',
      [req.params.id]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'Journal not found' });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update journal' });
  }
});

// Delete journal
app.delete('/api/journals/:id', async (req, res) => {
  try {
    const [result] = await db.query('DELETE FROM journals WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Journal not found' });
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete journal' });
  }
});

// SPA fallback
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Journal server running at http://localhost:${PORT}`);
});
