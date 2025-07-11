import express from 'express';
import { supabase } from './supabase.js';

const app = express();
app.use(express.json());

// Example API route to fetch data from a 'users' table in Supabase
app.get('/api/users', async (req, res) => {
  try {
    const { data, error } = await supabase.from('users').select('*');

    if (error) {
      throw error;
    }

    res.status(200).json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Vercel will use this exported app
export default app;