import dotenv from 'dotenv';
import app from './index.js';

dotenv.config();

const port = process.env.PORT || 3001;

app.listen(port, () => {
  console.log(`[server]: API server listening on http://localhost:${port}`);
});