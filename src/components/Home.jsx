import { useMemo } from 'react';
import { getAttendanceRate, getAttendedCount, getThisMonthAttendedCount } from '../utils/attendance';

function Home({ currentMember, onCurrentMemberChange, members, schedules, onOpenMemberSession }) {
  const statsByMember = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    return members.map((name) => {
      const mySchedules = schedules.filter(
        (s) => s.participants && s.participants.includes(name)
      );
      const upcoming = mySchedules.filter((s) => s.date >= today).length;
      const attended = getAttendedCount(name, schedules);
      const thisMonth = getThisMonthAttendedCount(name, schedules);
      const rate = getAttendanceRate(name, schedules);
      return { name, upcoming, attended, thisMonth, rate, total: mySchedules.length };
    });
  }, [members, schedules]);

  const totalAttendanceStats = useMemo(() => {
    const sessionsWithAttendance = schedules.filter(
      (s) => s.attendance && s.attendance.length > 0
    ).length;
    const thisMonthTotal = members.reduce(
      (sum, name) => sum + getThisMonthAttendedCount(name, schedules),
      0
    );
    return { sessionsWithAttendance, thisMonthTotal };
  }, [members, schedules]);

  return (
    <main className="home home--first">
      <section className="home-section">
        <h2 className="section-label">참여자 선택 (나)</h2>
        <p className="home-hint">내 세션에서 일정·출석·운동 기록을 관리할 수 있어요.</p>
        <div className="member-selector">
          <select
            value={currentMember}
            onChange={(e) => onCurrentMemberChange(e.target.value)}
            aria-label="나는"
            className="member-selector__select"
          >
            <option value="">선택하세요</option>
            {members.map((name) => (
              <option key={name} value={name}>{name}</option>
            ))}
          </select>
          {currentMember && (
            <button
              type="button"
              className="btn btn-primary member-selector__go"
              onClick={() => onOpenMemberSession(currentMember)}
            >
              내 세션 가기
            </button>
          )}
        </div>
      </section>

      <section className="home-section">
        <h2 className="section-label">전체 출석 현황</h2>
        <div className="home-stats-bar">
          <span className="home-stats-bar__item">
            출석 체크된 세션 <strong>{totalAttendanceStats.sessionsWithAttendance}</strong>건
          </span>
          <span className="home-stats-bar__item">
            이번 달 출석 합계 <strong>{totalAttendanceStats.thisMonthTotal}</strong>회
          </span>
        </div>
      </section>

      <section className="home-section">
        <h2 className="section-label">전체 참여자 현황</h2>
        <p className="home-hint">클릭하면 해당 참여자 세션으로 이동해요.</p>
        <div className="member-cards">
          {statsByMember.map(({ name, upcoming, attended, thisMonth, rate }) => (
            <button
              key={name}
              type="button"
              className="member-card"
              onClick={() => onOpenMemberSession(name)}
            >
              <span className="member-card__name">{name}</span>
              <span className="member-card__stat">다음 일정 {upcoming}건</span>
              <span className="member-card__stat">출석 {attended}회</span>
              {thisMonth > 0 && (
                <span className="member-card__stat member-card__stat--accent">
                  이번 달 {thisMonth}회
                </span>
              )}
              {rate != null && (
                <span className="member-card__stat member-card__stat--rate">
                  출석률 {rate}%
                </span>
              )}
            </button>
          ))}
        </div>
      </section>

      <section className="home-section">
        <h2 className="section-label">스터디 & 활동</h2>
        <div className="studies-grid studies-grid--compact">
          {[
            { id: 'paper', name: '논문 스터디', icon: '📄' },
            { id: 'exercise', name: '운동', icon: '💪' },
            { id: 'reading', name: '독서 스터디', icon: '📚' },
            { id: 'research', name: '연구', icon: '🔬' },
          ].map((s) => (
            <button
              key={s.id}
              type="button"
              className="study-card study-card--compact"
              onClick={() => onOpenMemberSession(currentMember || members[0], s.id)}
            >
              <span className="study-icon">{s.icon}</span>
              <span className="study-name">{s.name}</span>
            </button>
          ))}
        </div>
      </section>
    </main>
  );
}

export default Home;
