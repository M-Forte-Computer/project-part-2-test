"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../components/Navbar';
import styles from '../app/page.module.css';

function TasksPage() {
  const [newTask, setNewTask] = useState({ title: '', description: '' });
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newTask.title || !newTask.description) return;

    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTask),
      });

      if (!response.ok) {
        throw new Error('Failed to create task');
      }

      await response.json();
      router.push('/projects');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className={styles.container}>
      <Navbar />
      <h1 className={styles.heading}>Create New Task</h1>
      {error && <p className={styles.error}>{error}</p>}
      <form className={styles.taskForm} onSubmit={handleSubmit}>
        <input
          className={styles.input}
          type="text"
          placeholder="Title"
          value={newTask.title}
          onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
        />
        <input
          className={styles.input}
          type="text"
          placeholder="Description"
          value={newTask.description}
          onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
        />
        <button className={styles.button} type="submit">Add Task</button>
      </form>
    </div>
  );
}

export default TasksPage;
