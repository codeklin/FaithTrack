import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error(
    'VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be defined in .env file'
  );
}

export const supabase = createClient(supabaseUrl, supabaseServiceKey);