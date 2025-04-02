"use client";
import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import styles from '../app/page.module.css';

function ProjectsPage() {
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchTasks() {
      try {
        const response = await fetch('/api/tasks');
        if (!response.ok) {
          throw new Error('Failed to fetch tasks');
        }
        const data = await response.json();
        setTasks(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message);
      }
    }
    fetchTasks();
  }, []);

  const handleDelete = async (id) => {
   
    if (!window.confirm('Are you sure you want to delete this task?')) {
      return;
    }

    try {
      const response = await fetch(`/api/tasks?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete task');
      }

      setTasks(tasks.filter(task => task.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className={styles.container}>
      <Navbar />
      <h1 className={styles.heading}>Projects</h1>
      {error && <p className={styles.error}>{error}</p>}
      <div className={styles.taskGrid}>
        {tasks.map((task) => (
          <div key={task.id} className={styles.taskCard}>
            <h3 className={styles.taskTitle}>{task.title}</h3>
            <p className={styles.taskDescription}>{task.description}</p>
            <button 
              onClick={() => handleDelete(task.id)}
              className={`${styles.button} ${styles.deleteButton}`}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProjectsPage;
