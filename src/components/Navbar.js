"use client";
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from '../app/page.module.css';

function Navbar() {
  return (
    <nav className={styles.nav}>
      <div className={styles.navContent}>
        <div className={styles.logoContainer}>
          <Image
            src="/logo.png"
            alt="Task Management App Logo"
            width={40}
            height={40}
            className={styles.logo}
          />
          <span className={styles.logoText}>Task Management App</span>
        </div>
        <ul className={styles.navList}>
          <li><Link className={styles.navLink} href="/home">Home</Link></li>
          <li><Link className={styles.navLink} href="/projects">Projects</Link></li>
          <li><Link className={styles.navLink} href="/tasks">Tasks</Link></li>
          <li><Link className={styles.navLink} href="/signup">Signup</Link></li> 
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
