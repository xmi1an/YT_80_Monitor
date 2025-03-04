import { useState, useEffect, memo } from 'react';
import styles from '../styles/Home.module.css';

const DigitalClock = memo(({ adminUrl = '/admin' }) => {
  const [time, setTime] = useState('');
  const [date, setDate] = useState('');

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('en-US', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }));
      setDate(now.toLocaleDateString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric'
      }));
    };

    updateDateTime();
    const timeInterval = setInterval(updateDateTime, 1000);
    return () => clearInterval(timeInterval);
  }, []);

  return (
    <a href={adminUrl} target="_blank" rel="noopener noreferrer" className={styles.digitalClock}>
      <div className={styles.time}>{time}</div>
      <div className={styles.date}>{date}</div>
    </a>
  );
});

DigitalClock.displayName = 'DigitalClock';

export default DigitalClock;
