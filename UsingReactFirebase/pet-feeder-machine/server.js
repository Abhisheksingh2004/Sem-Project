import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import compression from 'compression';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Enable compression for all responses
app.use(compression());

// Serve static files from the dist directory
app.use(express.static('dist'));

// Handle all routes for the SPA
app.get('*', (req, res) => {
  res.sendFile(resolve(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 