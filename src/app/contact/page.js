"use client";
import React, { useState } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import styles from '../page.module.css';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [status, setStatus] = useState({ type: '', message: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit message');
      }

      setStatus({ 
        type: 'success', 
        message: 'Thank you for your message! We will get back to you soon.' 
      });
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      setStatus({ type: 'error', message: err.message });
    }
  };

  return (
    <div className={styles.container}>
      <Navbar />
      <div className={styles.centerContent}>
        <h1 className={styles.heading}>Contact Us</h1>
        <div className={styles.contactContainer}>
          <form className={styles.contactForm} onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Your Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className={styles.input}
              required
            />
            <input
              type="email"
              placeholder="Your Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className={styles.input}
              required
            />
            <input
              type="text"
              placeholder="Subject"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              className={styles.input}
              required
            />
            <textarea
              placeholder="Your Message"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className={`${styles.input} ${styles.textarea}`}
              required
            />
            <button type="submit" className={styles.button}>Send Message</button>
          </form>
          {status.message && (
            <p className={status.type === 'success' ? styles.success : styles.error}>
              {status.message}
            </p>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
