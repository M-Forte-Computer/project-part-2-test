"use client";
import React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';  
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import styles from '../page.module.css';

class TaskPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      newTask: { title: '', description: '' },
      error: null,
      longestTask: null,
      timeActive: 0
    };
  }

  componentDidMount() {
    this.fetchLongestTask();
    this.timer = setInterval(() => {
      this.setState(prev => ({ timeActive: prev.timeActive + 1 }));
    }, 1000);
  }

  componentWillUnmount() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  fetchLongestTask = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/tasks/longest', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          this.setState({ longestTask: null });
          return;
        }
        throw new Error('Failed to fetch longest task');
      }

      const data = await response.json();
      this.setState({ 
        longestTask: {
          title: data.title,
          description: data.description,
          createdAt: data.formattedCreatedAt,
          duration: data.duration
        }
      });
    } catch (err) {
      this.setState({ error: err.message });
    }
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(this.state.newTask),
      });

      if (!response.ok) throw new Error('Failed to create task');
      this.props.router.push('/projects');
    } catch (err) {
      this.setState({ error: err.message });
    }
  };

  render() {
    const { newTask, error, longestTask, timeActive } = this.state;
    return (
      <div className={styles.container}>
        <Navbar />
        <h1 className={styles.heading}>Create New Task</h1>
        {error && <p className={styles.error}>{error}</p>}
        {longestTask && (
          <div className={styles.longestTask}>
            <h2>Longest Active Task</h2>
            <p className={styles.taskTitle}>{longestTask.title}</p>
            <p className={styles.taskDescription}>{longestTask.description}</p>
            <p className={styles.taskCreatedAt}>Created: {longestTask.createdAt}</p>
            <p className={styles.taskDuration}>Active for: {longestTask.duration}</p>
            <p className={styles.pageTimer}>Page active for: {timeActive} seconds</p>
            <Link href="/projects" className={`${styles.button} ${styles.viewButton}`}>
              View All Projects
            </Link>
          </div>
        )}
        <form className={styles.taskForm} onSubmit={this.handleSubmit}>
          <input
            className={styles.input}
            type="text"
            placeholder="Title"
            value={newTask.title}
            onChange={(e) => this.setState({
              newTask: { ...newTask, title: e.target.value }
            })}
          />
          <input
            className={styles.input}
            type="text"
            placeholder="Description"
            value={newTask.description}
            onChange={(e) => this.setState({
              newTask: { ...newTask, description: e.target.value }
            })}
          />
          <button className={styles.button} type="submit">Add Task</button>
        </form>
        <Footer />
      </div>
    );
  }
}

export default function Page() {
  const router = useRouter();
  return <TaskPage router={router} />;
}
