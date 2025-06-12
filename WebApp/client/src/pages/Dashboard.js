import React, { useEffect, useState } from "react";
import { Button, Typography, Box, TextField, List, ListItem, Checkbox } from "@mui/material";
import ThemeToggle from "../components/ThemeToggle"; // at top

export default function Dashboard({ token, onLogout }) {
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
    fetchTasks();
  }, []);

  const addTask = async () => {
    await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: token },
      body: JSON.stringify({ title, date }),
    });
    setTitle("");
    setDate("");
    fetchTasks();
  };

  const toggleTask = async (id, completed) => {
    await fetch(`/api/tasks/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: token },
      body: JSON.stringify({ completed: completed ? 0 : 1 }),
    });
    fetchTasks();
  };

  return (
    <>
      <Box sx={{ p: 4 }}>
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
          <Button variant="contained" onClick={addTask}>Add</Button>
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
        <Button variant="contained" color="error" onClick={onLogout} sx={{ mt: 3 }}>
          Logout
        </Button>
      </Box>

      {/* Theme Toggle placed at bottom right of screen */}
      <ThemeToggle />
    </>
  );

}
