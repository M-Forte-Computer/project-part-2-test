"use client";
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import styles from '../app/page.module.css';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login'); 
    }
  }, [router]);

  return (
    <div className={styles.container}>
      <Navbar />
      <h1 className={styles.heading}>Welcome to the Home Page</h1>
      <p>This website is to help people keep track of projects.</p>
      <Footer />
    </div>
  );
}
