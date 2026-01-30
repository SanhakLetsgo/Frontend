import { useState, useCallback } from 'react';
import { DAILY_CHECKINS_KEY } from '../data/constants';

function load() {
  try {
    const raw = localStorage.getItem(DAILY_CHECKINS_KEY);
    const list = raw ? JSON.parse(raw) : [];
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

function save(list) {
  localStorage.setItem(DAILY_CHECKINS_KEY, JSON.stringify(list));
}

export function useDailyCheckIns() {
  const [checkIns, setCheckIns] = useState(load);

  const addCheckIn = useCallback((memberName) => {
    const today = new Date().toISOString().slice(0, 10);
    setCheckIns((prev) => {
      const exists = prev.some(
        (e) => e.memberName === memberName && e.date === today
      );
      if (exists) return prev;
      const next = [...prev, { memberName, date: today }];
      save(next);
      return next;
    });
  }, []);

  const getDatesForMember = useCallback(
    (memberName) =>
      checkIns
        .filter((e) => e.memberName === memberName)
        .map((e) => e.date)
        .sort(),
    [checkIns]
  );

  const hasCheckedInToday = useCallback(
    (memberName) => {
      const today = new Date().toISOString().slice(0, 10);
      return checkIns.some(
        (e) => e.memberName === memberName && e.date === today
      );
    },
    [checkIns]
  );

  return { addCheckIn, getDatesForMember, hasCheckedInToday };
}
