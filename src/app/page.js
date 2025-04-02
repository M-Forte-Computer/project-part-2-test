"use client";
import React from 'react';
import Navbar from '../components/Navbar';
import HomePage from '../pages/HomePage';
import styles from './page.module.css';

export default function Home() {
  return (
    <div className={styles.page}>
      <Navbar />
      <main className={styles.main}>
        <HomePage />
      </main>
    </div>
  );
}
