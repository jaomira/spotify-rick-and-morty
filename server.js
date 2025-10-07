const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Serve static HTML
app.use(express.static(path.join(__dirname)));

// Simple in-memory "database"
let items = [
  { id: 1, title: 'Item 1', body: 'Conteúdo 1' },
  { id: 2, title: 'Item 2', body: 'Conteúdo 2' }
];
let nextId = 3;

// Get all
app.get('/api/items', (req, res) => {
  res.json(items);
});

// Get by id
app.get('/api/items/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const item = items.find(i => i.id === id);
  if (!item) return res.status(404).json({ error: 'Not found' });
  res.json(item);
});

// Create
app.post('/api/items', (req, res) => {
  const { title, body } = req.body;
  if (!title) return res.status(400).json({ error: 'title is required' });
  const item = { id: nextId++, title, body };
  items.push(item);
  res.status(201).json(item);
});

// Update
app.put('/api/items/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const index = items.findIndex(i => i.id === id);
  if (index === -1) return res.status(404).json({ error: 'Not found' });
  const { title, body } = req.body;
  items[index] = { ...items[index], title: title ?? items[index].title, body: body ?? items[index].body };
  res.json(items[index]);
});

// Delete
app.delete('/api/items/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const index = items.findIndex(i => i.id === id);
  if (index === -1) return res.status(404).json({ error: 'Not found' });
  const removed = items.splice(index, 1)[0];
  res.json(removed);
});

// Fallback to serve the html demo
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'api-demo-express.html'));
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on http://localhost:${port}`));
