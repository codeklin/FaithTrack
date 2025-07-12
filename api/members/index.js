import { createClient } from '@supabase/supabase-js';

// It's best practice to use environment variables for Supabase credentials
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('members')
      .select('*')
      .order('full_name', { ascending: true });

    if (error) {
      console.error('Error fetching members:', error.message);
      return res.status(500).json({ error: `Database error: ${error.message}` });
    }

    // Supabase returns `null` for data if the table is empty. Return an empty array instead.
    return res.status(200).json(data || []);
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}