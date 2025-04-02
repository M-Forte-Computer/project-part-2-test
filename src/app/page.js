"use client";
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login'); 
    } else {
      router.push('/projects'); 
    }
  }, [router]);

  return null; 
}
