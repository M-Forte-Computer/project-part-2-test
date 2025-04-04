"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from '../page.module.css';

export default function LoginPage() {
  const [isSignup, setIsSignup] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const endpoint = isSignup ? 'http://localhost:3000/api/auth/signup' : 'http://localhost:3000/api/auth/login';
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(isSignup ? 'Signup failed' : 'Login failed');
      }

      if (isSignup) {
        setSuccess('Account created successfully. You can now log in.');
        setError(null);
        setFormData({ email: '', password: '' });
        setIsSignup(false);
      } else {
        const data = await response.json();
        localStorage.setItem('token', data.token);
        router.push('/home'); 
      }
    } catch (err) {
      setError(err.message);
      setSuccess(null);
    }
  };

  return (
    <div className={styles.centerContainer}>
      <h1 className={styles.heading}>{isSignup ? 'Create an Account' : 'Login'}</h1>
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
        <button type="submit" className={styles.button}>
          {isSignup ? 'Signup' : 'Login'}
        </button>
      </form>
      <p className={styles.redirect}>
        {isSignup ? (
          <>
            Already have an account?{' '}
            <button
              className={styles.linkButton}
              onClick={() => {
                setIsSignup(false);
                setError(null);
                setSuccess(null);
              }}
            >
              Login here
            </button>
          </>
        ) : (
          <>
            Don't have an account?{' '}
            <button
              className={styles.linkButton}
              onClick={() => {
                setIsSignup(true);
                setError(null);
                setSuccess(null);
              }}
            >
              Create one
            </button>
          </>
        )}
      </p>
    </div>
  );
}
