import { useMemo } from 'react';

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];

function AttendanceCalendar({ checkInDates = [], year, month }) {
  const { days, firstDay, daysInMonth } = useMemo(() => {
    const d = new Date(year, month, 1);
    const firstDay = d.getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days = [];
    for (let i = 1; i <= daysInMonth; i++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      days.push({ day: i, dateStr });
    }
    return { days, firstDay, daysInMonth };
  }, [year, month]);

  const checkInSet = useMemo(
    () => new Set(checkInDates),
    [checkInDates]
  );

  const monthLabel = `${year}년 ${month + 1}월`;

  return (
    <div className="attendance-calendar">
      <div className="attendance-calendar__title">{monthLabel}</div>
      <div className="attendance-calendar__weekdays">
        {WEEKDAYS.map((w) => (
          <span key={w} className="attendance-calendar__weekday">
            {w}
          </span>
        ))}
      </div>
      <div className="attendance-calendar__grid">
        {Array.from({ length: firstDay }, (_, i) => (
          <span key={`empty-${i}`} className="attendance-calendar__cell attendance-calendar__cell--empty" />
        ))}
        {days.map(({ day, dateStr }) => {
          const isChecked = checkInSet.has(dateStr);
          const isToday =
            dateStr === new Date().toISOString().slice(0, 10);
          return (
            <span
              key={dateStr}
              className={`attendance-calendar__cell ${isChecked ? 'attendance-calendar__cell--checked' : ''} ${isToday ? 'attendance-calendar__cell--today' : ''}`}
              title={isChecked ? `${dateStr} 출석` : ''}
            >
              {day}
            </span>
          );
        })}
      </div>
      <div className="attendance-calendar__legend">
        <span className="attendance-calendar__legend-item">
          <span className="attendance-calendar__legend-dot attendance-calendar__legend-dot--checked" />
          출석
        </span>
        <span className="attendance-calendar__legend-item">
          <span className="attendance-calendar__legend-dot attendance-calendar__legend-dot--today" />
          오늘
        </span>
      </div>
    </div>
  );
}

export default AttendanceCalendar;
