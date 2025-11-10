const express = require('express');
const router = express.Router();

// TEMP in-memory projects store for testing
let projects = [];

// GET /api/projects - list all projects
router.get('/', (req, res) => {
  res.json(projects);
});

// GET /api/projects/:id - get one project
router.get('/:id', (req, res) => {
  const project = projects.find(p => p.id == req.params.id);
  if (!project) return res.status(404).json({ error: 'Not found' });
  res.json(project);
});

// POST /api/projects - create
router.post('/', (req, res) => {
  const project = { ...req.body, id: Date.now().toString() };
  projects.unshift(project);
  res.status(201).json(project);
});

// PUT /api/projects/:id - update
router.put('/:id', (req, res) => {
  const idx = projects.findIndex(p => p.id == req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  projects[idx] = { ...projects[idx], ...req.body };
  res.json(projects[idx]);
});

// DELETE /api/projects/:id
router.delete('/:id', (req, res) => {
  const idx = projects.findIndex(p => p.id == req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  const deleted = projects.splice(idx, 1);
  res.json(deleted[0]);
});

module.exports = router;
