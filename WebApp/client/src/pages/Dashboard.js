import React, { useEffect, useState } from "react";
import {
  Typography,
  Box,
  Button,
  TextField,
  List,
  ListItem,
  Checkbox,
} from "@mui/material";
import Layout from "../components/Layout";
import { getUserFromToken } from "../utils/decodeToken"; // you need to create this
import ThemeToggle from "../components/ThemeToggle"; // at top
export default function Dashboard({ token, onLogout }) {
  const user = getUserFromToken(token);
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");

  const fetchTasks = async () => {
    const res = await fetch("/api/tasks", {
      headers: { Authorization: token },
    });
    const data = await res.json();
    setTasks(data);
  };

useEffect(() => {
  const user = getUserFromToken(token);
  console.log("Decoded Token:", user);
}, []);

  const addTask = async () => {
    await fetch("/api/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify({ title, date }),
    });
    setTitle("");
    setDate("");
    fetchTasks();
  };

  const toggleTask = async (id, completed) => {
    await fetch(`/api/tasks/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify({ completed: completed ? 0 : 1 }),
    });
    fetchTasks();
  };

  return (
    <Layout onLogout={onLogout} user={user}>
      <Typography variant="h4">Daily Planner</Typography>
      <Box sx={{ mt: 2, display: "flex", gap: 2 }}>
        <TextField
          label="Task"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <TextField
          label="Date"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <Button variant="contained" onClick={addTask}>
          Add
        </Button>
      </Box>

      <List sx={{ mt: 2 }}>
        {tasks.map((t) => (
          <ListItem
            key={t.id}
            secondaryAction={
              <Checkbox
                checked={t.completed === 1}
                onChange={() => toggleTask(t.id, t.completed)}
              />
            }
          >
            {t.title} — {t.date}
          </ListItem>
        ))}
      </List>
      {/* Fixed position Theme Toggle */}
      <Box sx={{ position: 'fixed', bottom: 16, right: 16 }}>
        <ThemeToggle />
      </Box>
    </Layout>
  );
}
