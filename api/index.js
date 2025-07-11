// server/index.ts
import express from "express";

// server/supabase.ts
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config({ path: ".env" });
var supabaseUrl = process.env.VITE_SUPABASE_URL;
var supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error(
    "VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be defined in .env file"
  );
}
var supabase = createClient(supabaseUrl, supabaseServiceKey);

// server/index.ts
var app = express();
app.use(express.json());
app.get("/api/users", async (req, res) => {
  try {
    const { data, error } = await supabase.from("users").select("*");
    if (error) {
      throw error;
    }
    res.status(200).json(data);
  } catch (error) {
    // Log the full error for debugging on the server
    console.error('Error fetching users:', error);

    // Send a more structured error response to the client
    res.status(error.code ? 400 : 500).json({
      message: error.message,
      details: error.details,
      code: error.code,
    });
  }
});
var index_default = app;
export {
  index_default as default
};
