"use client";
import React from 'react';
import styles from '../app/page.module.css'; 

function HomePage() {
  return (
    <div className={styles.main}>
      <h1 className={styles.heading}>Welcome to the Task Management App</h1>
      <p className={styles.text}>Organize your projects and tasks efficiently.</p>
    </div>
  );
}

export default HomePage;
