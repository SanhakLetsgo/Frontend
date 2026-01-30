import { useState, useCallback } from 'react';

const STORAGE_KEY = 'study-hub-workout-logs';

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function save(list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

function nowTime() {
  return new Date().toTimeString().slice(0, 5);
}

export function useWorkoutLogs() {
  const [logs, setLogs] = useState(load);

  const getTodayLog = useCallback(
    (memberName) => {
      const today = todayStr();
      return logs.find((l) => l.memberName === memberName && l.date === today) || null;
    },
    [logs]
  );

  const setStartTime = useCallback((memberName) => {
    const today = todayStr();
    const time = nowTime();
    setLogs((prev) => {
      const idx = prev.findIndex((l) => l.memberName === memberName && l.date === today);
      const next = [...prev];
      if (idx >= 0) {
        next[idx] = { ...next[idx], startTime: time };
      } else {
        next.push({ memberName, date: today, startTime: time, endTime: null });
      }
      save(next);
      return next;
    });
  }, []);

  const setEndTime = useCallback((memberName) => {
    const today = todayStr();
    const time = nowTime();
    setLogs((prev) => {
      const idx = prev.findIndex((l) => l.memberName === memberName && l.date === today);
      const next = [...prev];
      if (idx >= 0) {
        next[idx] = { ...next[idx], endTime: time };
      } else {
        next.push({ memberName, date: today, startTime: null, endTime: time });
      }
      save(next);
      return next;
    });
  }, []);

  return { getTodayLog, setStartTime, setEndTime };
}
