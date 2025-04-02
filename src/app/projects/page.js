"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import styles from '../page.module.css';

export default function Page() {
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login'); 
      return;
    }

    async function verifyToken() {
      try {
        const response = await fetch('/api/auth/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token }),
        });

        if (!response.ok) {
          throw new Error('Invalid or expired token');
        }
      } catch (err) {
        setError(err.message);
        router.push('/login'); 
      }
    }

    async function fetchTasks() {
      try {
        const response = await fetch('/api/tasks', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch tasks');
        }
        const data = await response.json();
        setTasks(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message);
      }
    }

    verifyToken().then(fetchTasks);
  }, [router]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this task?')) {
      return;
    }

    try {
      const response = await fetch(`/api/tasks?id=${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
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
      <Footer />
    </div>
  );
}
