import { useState, useMemo } from 'react';
import { STUDIES, EXERCISE_TYPES } from '../data/constants';
import { formatDate } from '../utils/format';
import { getAttendanceRate, getThisMonthAttendedCount, getAttendedCount } from '../utils/attendance';
import ScheduleForm from './ScheduleForm';
import AttendanceCalendar from './AttendanceCalendar';

function MemberSessionView({
  memberName,
  schedules,
  onGoHome,
  onAddSchedule,
  onRemoveSchedule,
  onAttendanceClick,
  updateAttendance,
  updateExerciseDone,
  members,
  initialStudyTab,
  dailyCheckIn,
}) {
  const [tab, setTab] = useState(initialStudyTab ? 'studies' : 'schedule');
  const [studyTab, setStudyTab] = useState(initialStudyTab || null);
  const [modalOpen, setModalOpen] = useState(false);

  const mySchedules = schedules.filter(
    (s) => s.participants && s.participants.includes(memberName)
  );
  const today = new Date().toISOString().slice(0, 10);
  const upcomingSchedules = mySchedules.filter((s) => s.date >= today);
  const attendedSessions = schedules.filter(
    (s) => s.attendance && s.attendance.includes(memberName)
  );
  const exerciseSessions = schedules.filter((s) => s.studyId === 'exercise');

  const attendanceSummary = useMemo(() => ({
    total: getAttendedCount(memberName, schedules),
    thisMonth: getThisMonthAttendedCount(memberName, schedules),
    rate: getAttendanceRate(memberName, schedules),
  }), [memberName, schedules]);

  return (
    <section className="panel member-session">
      <div className="member-session-header">
        <h2 className="member-session-title">{memberName}님 세션</h2>
        <p className="member-session-desc">내 일정·출석·스터디별 기록을 관리해요.</p>
      </div>

      <div className="tabs">
        <button
          type="button"
          className={`tabs__btn ${tab === 'schedule' ? 'active' : ''}`}
          onClick={() => { setTab('schedule'); setStudyTab(null); }}
        >
          내 일정
        </button>
        <button
          type="button"
          className={`tabs__btn ${tab === 'attendance' ? 'active' : ''}`}
          onClick={() => { setTab('attendance'); setStudyTab(null); }}
        >
          출석 현황
        </button>
        <button
          type="button"
          className={`tabs__btn ${tab === 'studies' ? 'active' : ''}`}
          onClick={() => { setTab('studies'); setStudyTab(null); }}
        >
          스터디별
        </button>
      </div>

      {tab === 'schedule' && (
        <div className="member-session-content">
          <div className="schedule-list">
            {upcomingSchedules.length === 0 ? (
              <div className="schedule-empty">다가오는 일정이 없어요.</div>
            ) : (
              upcomingSchedules.map((item) => {
                const study = STUDIES.find((s) => s.id === item.studyId);
                const studyName = study ? study.name : item.studyId;
                return (
                  <div key={item.id} className="schedule-item">
                    <span className="schedule-date">{formatDate(item.date)}</span>
                    <span className="schedule-time">{item.time || ''}</span>
                    <span className="schedule-study">{studyName}</span>
                    {item.note ? <span className="schedule-note">{item.note}</span> : null}
                    {item.attendance && item.attendance.length > 0 && (
                      <span className="schedule-attendance">
                        출석: {item.attendance.join(', ')}
                      </span>
                    )}
                    <div className="schedule-item-actions">
                      <button
                        type="button"
                        className="schedule-btn-attendance"
                        onClick={() => onAttendanceClick?.(item)}
                      >
                        출석
                      </button>
                      <button
                        type="button"
                        className="schedule-delete"
                        onClick={() => onRemoveSchedule(item.id)}
                        aria-label="삭제"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
          <button type="button" className="btn-add-schedule" onClick={() => setModalOpen(true)}>
            + 일정 추가
          </button>
        </div>
      )}

      {tab === 'attendance' && (
        <div className="member-session-content">
          <div className="daily-checkin-bar">
            <span className="daily-checkin-label">오늘 출석</span>
            {dailyCheckIn?.hasCheckedInToday(memberName) ? (
              <span className="daily-checkin-done">오늘 출석 완료</span>
            ) : (
              <button
                type="button"
                className="btn btn-daily-checkin"
                onClick={() => dailyCheckIn?.addCheckIn(memberName)}
                aria-label="오늘 출석하기"
              >
                출석하기
              </button>
            )}
            <p className="daily-checkin-hint">하루에 한 번만 출석할 수 있어요.</p>
          </div>
          {dailyCheckIn && (
            <div className="attendance-calendar-wrap">
              <h3 className="subsection-label">출석 달력</h3>
              <AttendanceCalendar
                checkInDates={dailyCheckIn.getDatesForMember(memberName)}
                year={new Date().getFullYear()}
                month={new Date().getMonth()}
              />
            </div>
          )}
          <div className="attendance-summary">
            <div className="attendance-summary__item">
              <span className="attendance-summary__label">전체 출석</span>
              <span className="attendance-summary__value">{attendanceSummary.total}회</span>
            </div>
            <div className="attendance-summary__item">
              <span className="attendance-summary__label">이번 달</span>
              <span className="attendance-summary__value attendance-summary__value--accent">
                {attendanceSummary.thisMonth}회
              </span>
            </div>
            {attendanceSummary.rate != null && (
              <div className="attendance-summary__item">
                <span className="attendance-summary__label">출석률</span>
                <span className="attendance-summary__value attendance-summary__value--rate">
                  {attendanceSummary.rate}%
                </span>
              </div>
            )}
          </div>
          <h3 className="subsection-label">내가 출석한 세션</h3>
          {attendedSessions.length === 0 ? (
            <p className="empty-hint">아직 출석한 세션이 없어요. 일정에 참여한 뒤 출석 체크를 해 주세요.</p>
          ) : (
            <ul className="attendance-list">
              {attendedSessions.map((item) => {
                const study = STUDIES.find((s) => s.id === item.studyId);
                const studyName = study ? study.name : item.studyId;
                return (
                  <li key={item.id} className="attendance-list-item">
                    <span className="schedule-date">{formatDate(item.date)}</span>
                    <span className="schedule-study">{studyName}</span>
                    <span className="attendance-badge">출석 완료</span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}

      {tab === 'studies' && !studyTab && (
        <div className="member-session-content">
          <p className="home-hint">스터디/활동을 선택하면 해당 일정과 기록을 볼 수 있어요.</p>
          <div className="studies-grid">
            {STUDIES.map((s) => (
              <button
                key={s.id}
                type="button"
                className={`study-card ${s.accent}`}
                onClick={() => setStudyTab(s.id)}
              >
                <div className="study-icon">{s.icon}</div>
                <div className="study-name">{s.name}</div>
                <div className="study-desc">{s.desc}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {tab === 'studies' && studyTab === 'exercise' && (
        <ExercisePanel
          memberName={memberName}
          sessions={exerciseSessions.filter(
            (s) => s.participants && s.participants.includes(memberName)
          )}
          allSessions={exerciseSessions}
          onBack={() => setStudyTab(null)}
          onAttendanceClick={onAttendanceClick}
          updateExerciseDone={updateExerciseDone}
          members={members}
          exerciseTypes={EXERCISE_TYPES}
        />
      )}

      {tab === 'studies' && studyTab && studyTab !== 'exercise' && (
        <div className="member-session-content">
          <button type="button" className="btn-back" onClick={() => setStudyTab(null)}>
            ← 목록
          </button>
          <h3 className="subsection-label">
            {STUDIES.find((s) => s.id === studyTab)?.name || studyTab} 일정
          </h3>
          <ul className="schedule-list">
            {mySchedules
              .filter((s) => s.studyId === studyTab)
              .map((item) => {
                const study = STUDIES.find((s) => s.id === item.studyId);
                return (
                  <li key={item.id} className="schedule-item">
                    <span className="schedule-date">{formatDate(item.date)}</span>
                    <span className="schedule-time">{item.time || ''}</span>
                    {item.attendance && item.attendance.length > 0 && (
                      <span className="schedule-attendance">
                        출석: {item.attendance.join(', ')}
                      </span>
                    )}
                    <button
                      type="button"
                      className="schedule-btn-attendance"
                      onClick={() => onAttendanceClick?.(item)}
                    >
                      출석
                    </button>
                  </li>
                );
              })}
          </ul>
        </div>
      )}

      <ScheduleForm
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={(data) => {
          onAddSchedule(data);
          setModalOpen(false);
        }}
      />
    </section>
  );
}

function ExercisePanel({
  memberName,
  sessions,
  allSessions,
  onBack,
  onAttendanceClick,
  updateExerciseDone,
  members,
  exerciseTypes,
}) {
  const [editingSessionId, setEditingSessionId] = useState(null);

  return (
    <div className="member-session-content exercise-panel">
      <button type="button" className="btn-back" onClick={onBack}>
        ← 스터디별
      </button>
      <h3 className="subsection-label">운동</h3>
      <p className="home-hint">출석 체크 후, 본인이 한 운동을 선택해 주세요.</p>

      {sessions.length === 0 ? (
        <p className="empty-hint">참여한 운동 일정이 없어요.</p>
      ) : (
        <div className="exercise-session-list">
          {sessions.map((item) => {
            const myDone = (item.exerciseDone && item.exerciseDone[memberName]) || [];
            const isEditing = editingSessionId === item.id;

            return (
              <div key={item.id} className="exercise-session-card">
                <div className="exercise-session-header">
                  <span className="schedule-date">{formatDate(item.date)}</span>
                  <span className="schedule-time">{item.time || ''}</span>
                  <span className="schedule-note">{item.note || ''}</span>
                </div>
                <div className="exercise-session-body">
                  <div className="exercise-session-row">
                    <span className="exercise-label">참여자 현황</span>
                    <span className="schedule-attendance">
                      {item.attendance && item.attendance.length > 0
                        ? item.attendance.join(', ')
                        : '출석 체크 전'}
                    </span>
                    <button
                      type="button"
                      className="schedule-btn-attendance"
                      onClick={() => onAttendanceClick?.(item)}
                    >
                      출석 체크
                    </button>
                  </div>
                  <div className="exercise-session-row">
                    <span className="exercise-label">내가 한 운동</span>
                    {isEditing ? (
                      <div className="exercise-types-edit">
                        {exerciseTypes.map((type) => {
                          const checked = myDone.includes(type);
                          return (
                            <label key={type} className="attendance-check">
                              <input
                                type="checkbox"
                                checked={checked}
                                onChange={() => {
                                  const next = checked
                                    ? myDone.filter((t) => t !== type)
                                    : [...myDone, type];
                                  updateExerciseDone(item.id, memberName, next);
                                }}
                              />
                              <span>{type}</span>
                            </label>
                          );
                        })}
                        <button
                          type="button"
                          className="btn btn-ghost btn-sm"
                          onClick={() => setEditingSessionId(null)}
                        >
                          완료
                        </button>
                      </div>
                    ) : (
                      <div className="exercise-types-display">
                        {myDone.length > 0 ? (
                          <span>{myDone.join(', ')}</span>
                        ) : (
                          <span className="text-muted">선택 안 함</span>
                        )}
                        <button
                          type="button"
                          className="btn btn-ghost btn-sm"
                          onClick={() => setEditingSessionId(item.id)}
                        >
                          수정
                        </button>
                      </div>
                    )}
                  </div>
                  {item.attendance && item.attendance.length > 0 && (
                    <div className="exercise-session-row">
                      <span className="exercise-label">전체 운동 내용</span>
                      <div className="exercise-all-done">
                        {members
                          .filter((m) => item.attendance.includes(m))
                          .map((m) => (
                            <span key={m} className="exercise-done-chip">
                              {m}: {(item.exerciseDone && item.exerciseDone[m])?.join(', ') || '-'}
                            </span>
                          ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default MemberSessionView;
