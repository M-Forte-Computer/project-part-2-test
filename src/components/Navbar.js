"use client";
import React from 'react';
import Link from 'next/link';
import styles from '../app/page.module.css';

function Navbar() {
  return (
    <nav className={styles.nav}>
      <ul className={styles.navList}>
        <li><Link className={styles.navLink} href="/">Home</Link></li>
        <li><Link className={styles.navLink} href="/projects">Projects</Link></li>
        <li><Link className={styles.navLink} href="/tasks">Tasks</Link></li>
        <li><Link className={styles.navLink} href="/signup">Signup</Link></li> {/* Add Signup link */}
      </ul>
    </nav>
  );
}

export default Navbar;
