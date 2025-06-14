const express = require('express'); 
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// API routes
const vocabRoutes = require('./routes/vocabularies');
app.use('/vocabularies', vocabRoutes);

// Serve static frontend (built with Vite)
const frontendPath = path.join(__dirname, '../frontend/dist');
if (fs.existsSync(frontendPath)) {
  app.use(express.static(frontendPath));

  // Fallback: serve index.html for all non-API routes (important!)
  app.get('*', (req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
  });
}

app.get('/', (req, res) => {
  res.send('✅ VocaServe API is live!. Use /vocabularies to access vocab data.');
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
