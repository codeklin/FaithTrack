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
    res.status(500).json({ error: error.message });
  }
});
app.get("/api/stats", async (req, res) => {
  try {
    console.log(`GET /api/stats called`);
    res.status(200).json({ message: "Endpoint /api/stats reached successfully", data: { totalMembers: 0, activeTasks: 0, completedTasks: 0 } });
  } catch (error) {
    console.error("Error in /api/stats:", error);
    res.status(500).json({ error: "Failed to process /api/stats" });
  }
});
app.get("/api/tasks/urgent", async (req, res) => {
  try {
    console.log(`GET /api/tasks/urgent called`);
    res.status(200).json({ message: "Endpoint /api/tasks/urgent reached successfully", data: [] });
  } catch (error) {
    console.error("Error in /api/tasks/urgent:", error);
    res.status(500).json({ error: "Failed to process /api/tasks/urgent" });
  }
});
app.get("/api/members", async (req, res) => {
  try {
    console.log(`GET /api/members called`);
    res.status(200).json({ message: "Endpoint /api/members reached successfully", data: [] });
  } catch (error) {
    console.error("Error in /api/members:", error);
    res.status(500).json({ error: "Failed to process /api/members" });
  }
});
app.get("/api/members/recent", async (req, res) => {
  try {
    console.log(`GET /api/members/recent called`);
    res.status(200).json({ message: "Endpoint /api/members/recent reached successfully", data: [] });
  } catch (error) {
    console.error("Error in /api/members/recent:", error);
    res.status(500).json({ error: "Failed to process /api/members/recent" });
  }
});
app.get("/api/pastors", async (req, res) => {
  try {
    const { data, error } = await supabase.from("pastors").select("id, name");
    if (error) {
      throw error;
    }
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
var index_default = app;
export {
  index_default as default
};
