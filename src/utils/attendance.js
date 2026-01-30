/**
 * 참여한 일정 중 이미 지난 일정 (출석 체크 대상)
 */
export function getPastSchedules(schedules) {
  const today = new Date().toISOString().slice(0, 10);
  return schedules.filter((s) => s.date < today);
}

/**
 * 멤버의 출석률: 출석한 세션 수 / 참여한 지난 세션 수
 * 참여한 지난 세션 = participants에 포함되고 date < 오늘
 */
export function getAttendanceRate(memberName, schedules) {
  const past = getPastSchedules(schedules);
  const myPast = past.filter(
    (s) => s.participants && s.participants.includes(memberName)
  );
  if (myPast.length === 0) return null;
  const attended = myPast.filter(
    (s) => s.attendance && s.attendance.includes(memberName)
  ).length;
  return Math.round((attended / myPast.length) * 100);
}

/**
 * 멤버가 출석한 총 횟수
 */
export function getAttendedCount(memberName, schedules) {
  return schedules.filter(
    (s) => s.attendance && s.attendance.includes(memberName)
  ).length;
}

/**
 * 이번 달 출석 횟수 (date가 이번 달인 세션 중 출석한 것)
 */
export function getThisMonthAttendedCount(memberName, schedules) {
  const now = new Date();
  const y = now.getFullYear();
  const m = now.getMonth();
  return schedules.filter((s) => {
    if (!s.attendance || !s.attendance.includes(memberName)) return false;
    const d = new Date(s.date + 'T12:00:00');
    return d.getFullYear() === y && d.getMonth() === m;
  }).length;
}
