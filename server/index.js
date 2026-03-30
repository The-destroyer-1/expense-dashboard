const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json({ limit: '20mb' }));

// Optional API key protection: if API_KEY is set in the environment,
// incoming requests must include header `x-api-key` matching it.
const API_KEY = process.env.API_KEY;
if (API_KEY) {
  app.use((req, res, next) => {
    const provided = req.headers['x-api-key'] || req.query['api_key'];
    if (!provided || String(provided) !== API_KEY) {
      return res.status(401).json({ error: 'Unauthorized - invalid or missing API key' });
    }
    next();
  });
}

const DATA_FILE = path.join(__dirname, 'backup.json');

app.post('/backup', (req, res) => {
  try {
    const body = req.body;
    // write pretty-printed JSON
    fs.writeFileSync(DATA_FILE, JSON.stringify(body, null, 2), 'utf8');
    res.json({ ok: true, savedAt: Date.now() });
  } catch (err) {
    console.error('Write error', err);
    res.status(500).json({ error: String(err) });
  }
});

app.get('/backup', (req, res) => {
  if (!fs.existsSync(DATA_FILE)) {
    return res.status(404).json({ error: 'No backup available' });
  }
  res.sendFile(DATA_FILE);
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Backup server listening on port ${PORT}`));
