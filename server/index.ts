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

// --- EXISTING PLACEHOLDER ROUTE (adjusted for consistency) ---
app.get('/api/stats', async (req, res) => {
  try {
    // TODO: Replace with actual logic to fetch stats
    console.log(`GET /api/stats called`);
    res.status(200).json({ message: "Endpoint /api/stats reached successfully", data: { totalMembers: 0, activeTasks: 0, completedTasks: 0 } });
  } catch (error: any) {
    console.error('Error in /api/stats:', error);
    res.status(500).json({ error: 'Failed to process /api/stats' });
  }
});

// --- ADDED GENERIC PLACEHOLDER ROUTES ---
app.get('/api/tasks/urgent', async (req, res) => {
  try {
    // TODO: Replace with actual logic to fetch urgent tasks
    console.log(`GET /api/tasks/urgent called`);
    res.status(200).json({ message: "Endpoint /api/tasks/urgent reached successfully", data: [] });
  } catch (error: any) {
    console.error('Error in /api/tasks/urgent:', error);
    res.status(500).json({ error: 'Failed to process /api/tasks/urgent' });
  }
});

app.get('/api/members', async (req, res) => {
  try {
    // TODO: Replace with actual logic to fetch members
    console.log(`GET /api/members called`);
    res.status(200).json({ message: "Endpoint /api/members reached successfully", data: [] });
  } catch (error: any) {
    console.error('Error in /api/members:', error);
    res.status(500).json({ error: 'Failed to process /api/members' });
  }
});

app.get('/api/members/recent', async (req, res) => {
  try {
    // TODO: Replace with actual logic to fetch recent members
    console.log(`GET /api/members/recent called`);
    res.status(200).json({ message: "Endpoint /api/members/recent reached successfully", data: [] });
  } catch (error: any) {
    console.error('Error in /api/members/recent:', error);
    res.status(500).json({ error: 'Failed to process /api/members/recent' });
  }
});

// TODO: Add other missing routes here, for example:
// app.get('/api/tasks/urgent', async (req, res) => { /* ... your logic ... */ });
// app.get('/api/members', async (req, res) => { /* ... your logic ... */ });
// app.get('/api/members/recent', async (req, res) => { /* ... your logic ... */ });
// etc.


// Vercel will use this exported app
export default app;