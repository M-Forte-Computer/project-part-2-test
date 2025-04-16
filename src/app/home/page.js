"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import styles from '../page.module.css';

export default function HomePage() {
  const router = useRouter();
  const [longestTask, setLongestTask] = useState(null);
  const [error, setError] = useState(null);
  const [timeActive, setTimeActive] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    const timer = setInterval(() => {
      setTimeActive(prev => prev + 1);
    }, 1000);

    const fetchLongestTask = async () => {
      try {
        const response = await fetch('/api/tasks/longest', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          if (response.status !== 404) {
            throw new Error('Failed to fetch longest task');
          }
          return;
        }

        const data = await response.json();
        setLongestTask(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchLongestTask();
    const taskInterval = setInterval(fetchLongestTask, 60000);
    return () => {
      clearInterval(timer);
      clearInterval(taskInterval);
    };
  }, [router]);

  return (
    <div className={styles.container}>
      <Navbar />
      <div className={styles.centerContent}>
        <h1 className={styles.heading}>Welcome to the Home Page</h1>
        <p className={styles.text}>This website is to help people keep track of projects.</p>
        
        {error && <p className={styles.error}>{error}</p>}
        {longestTask && (
          <div className={`${styles.longestTask} ${styles.homePageTask}`}>
            <h2>Longest Running Project</h2>
            <p className={styles.taskTitle}>{longestTask.title}</p>
            <p className={styles.taskDescription}>{longestTask.description}</p>
            <p className={styles.taskCreatedAt}>Created: {longestTask.formattedCreatedAt}</p>
            <p className={styles.taskDuration}>Active for: {longestTask.duration}</p>
            <p className={styles.pageTimer}>Page viewed for: {timeActive} seconds</p>
            <Link href="/projects" className={`${styles.button} ${styles.viewButton}`}>
              View All Projects
            </Link>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
