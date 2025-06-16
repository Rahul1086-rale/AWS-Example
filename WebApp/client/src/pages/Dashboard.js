import React, { useEffect, useState } from "react";
import {
  Typography,
  Box,
  Button,
  TextField,
  List,
  ListItem,
  Checkbox,
  Divider,
} from "@mui/material";
import Layout from "../components/Layout";
import { getUserFromToken } from "../utils/decodeToken";
import ThemeToggle from "../components/ThemeToggle";

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
    console.log("Decoded Token:", user);
    fetchTasks(); // ✅ fetch on mount
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

  const pendingTasks = tasks.filter((t) => t.completed === 0);
  const completedTasks = tasks.filter((t) => t.completed === 1);

  return (
    <Layout onLogout={onLogout} user={user}>
      <Typography
        variant="h5"
        sx={{
          fontWeight: "bold",
          letterSpacing: "0.5px",
          mb: 2,
          color: "text.primary",
        }}
      >
        🗓️ Daily Planner
      </Typography>

      <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
        <TextField
          label="Task"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          size="small"
          fullWidth
        />
        <TextField
          label="Date"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={date}
          onChange={(e) => setDate(e.target.value)}
          size="small"
        />
        <Button
          variant="contained"
          onClick={addTask}
          sx={{
            borderRadius: "28px",
            textTransform: "none",
            py: "10px",
            fontWeight: 500,
            fontSize: "0.875rem",
            boxShadow: "none",
            "&:hover": {
              boxShadow:
                "0px 3px 1px -2px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 1px 5px 0px rgba(0,0,0,0.12)",
            },
          }}
        >
          Add
        </Button>
      </Box>

      {/* To-Do Section */}
      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
        📌 To-do
      </Typography>
      <List dense>
        {pendingTasks.length === 0 ? (
          <Typography color="text.secondary" sx={{ ml: 2 }}>
            No tasks yet.
          </Typography>
        ) : (
          pendingTasks.map((t) => (
            <ListItem
              key={t.id}
              secondaryAction={
                <Checkbox
                  checked={false}
                  onChange={() => toggleTask(t.id, 0)}
                />
              }
            >
              {t.title} — {t.date}
            </ListItem>
          ))
        )}
      </List>

      <Divider sx={{ my: 3 }} />

      {/* Completed Section */}
      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
        ✅ Completed
      </Typography>
      <List dense>
        {completedTasks.length === 0 ? (
          <Typography color="text.secondary" sx={{ ml: 2 }}>
            No completed tasks.
          </Typography>
        ) : (
          completedTasks.map((t) => (
            <ListItem
              key={t.id}
              secondaryAction={
                <Checkbox
                  checked={true}
                  onChange={() => toggleTask(t.id, 1)}
                />
              }
              sx={{ textDecoration: "line-through", color: "text.secondary" }}
            >
              {t.title} — {t.date}
            </ListItem>
          ))
        )}
      </List>

      {/* Floating theme toggle */}
      <Box sx={{ position: "fixed", bottom: 16, right: 16 }}>
        <ThemeToggle />
      </Box>
    </Layout>
  );
}
