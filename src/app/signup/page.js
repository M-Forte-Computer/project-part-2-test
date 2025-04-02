"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from '../page.module.css';

export default function SignupPage() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Signup failed');
      }

      setSuccess('Account created successfully. You can now log in.');
      setError(null);
      setFormData({ email: '', password: '' });
    } catch (err) {
      setError(err.message);
      setSuccess(null);
    }
  };

  return (
    <div className={styles.centerContainer}>
      <h1 className={styles.heading}>Create an Account</h1>
      {error && <p className={styles.error}>{error}</p>}
      {success && <p className={styles.success}>{success}</p>}
      <form className={styles.form} onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className={styles.input}
        />
        <input
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          className={styles.input}
        />
        <button type="submit" className={styles.button}>Signup</button>
      </form>
      <p className={styles.redirect}>
        Already have an account? <a href="/login" className={styles.link}>Login here</a>.
      </p>
    </div>
  );
}
