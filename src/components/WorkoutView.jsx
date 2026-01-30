import React from 'react';
import { formatDate } from '../utils/format';
import AttendanceCalendar from './AttendanceCalendar';

function WorkoutView({
  memberName,
  onGoHome,
  dailyCheckIn,
  workoutLogs,
}) {
  const todayLog = workoutLogs.getTodayLog(memberName);
  const checkedToday = dailyCheckIn?.hasCheckedInToday(memberName);
  const checkInDates = dailyCheckIn?.getDatesForMember(memberName) ?? [];
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();

  return (
    <section className="panel workout-view">
      <div className="workout-view__header">
        <h2 className="workout-view__title">운동</h2>
        <p className="workout-view__date">{formatDate(now.toISOString().slice(0, 10))}</p>
      </div>

      <div className="workout-today">
        <div className="workout-today__row">
          <span className="workout-today__label">출석</span>
          {checkedToday ? (
            <span className="workout-today__done">출석 완료</span>
          ) : (
            <button
              type="button"
              className="btn btn-daily-checkin"
              onClick={() => dailyCheckIn?.addCheckIn(memberName)}
            >
              출석하기
            </button>
          )}
        </div>
        <div className="workout-today__row">
          <span className="workout-today__label">운동 시작 시간</span>
          {todayLog?.startTime ? (
            <span className="workout-today__time">{todayLog.startTime}</span>
          ) : (
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={() => workoutLogs.setStartTime(memberName)}
            >
              시작하기
            </button>
          )}
        </div>
        <div className="workout-today__row">
          <span className="workout-today__label">운동 끝난 시간</span>
          {todayLog?.endTime ? (
            <span className="workout-today__time">{todayLog.endTime}</span>
          ) : (
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={() => workoutLogs.setEndTime(memberName)}
            >
              종료하기
            </button>
          )}
        </div>
      </div>

      <div className="workout-calendar-wrap">
        <h3 className="subsection-label">출석 달력</h3>
        <AttendanceCalendar checkInDates={checkInDates} year={year} month={month} />
      </div>
    </section>
  );
}

export default WorkoutView;
