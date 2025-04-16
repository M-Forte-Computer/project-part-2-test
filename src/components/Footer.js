"use client";
import React from 'react';
import styles from '../app/page.module.css';

function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <div className={styles.footerSection}>
          <h2 className={styles.footerHeading}>Task Management App</h2>
          <p className={styles.footerCopyright}>&copy; 2025 All rights reserved</p>
        </div>
        <div className={styles.footerSection}>
          <h2 className={styles.footerHeading}>Contact Us</h2>
          <div className={styles.footerContacts}>
            <a href="mailto:mforte971@gmail.com" className={styles.footerLink}>mforte971@gmail.com</a>
            <a href="mailto:divinemensah102@gmail.com" className={styles.footerLink}>divinemensah102@gmail.com</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
