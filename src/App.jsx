import { useState, useEffect } from 'react';
import { MEMBERS, CURRENT_MEMBER_KEY, STUDIES } from './data/constants';
import { useSchedules } from './hooks/useSchedules';
import { formatDate } from './utils/format';
import Header from './components/Header';
import Home from './components/Home';
import SchedulePanel from './components/SchedulePanel';
import StudiesPanel from './components/StudiesPanel';
import MembersPanel from './components/MembersPanel';
import MemberSessionView from './components/MemberSessionView';
import ScheduleForm from './components/ScheduleForm';
import AttendanceModal from './components/AttendanceModal';

const VIEWS = {
  home: 'home',
  schedule: 'schedule',
  studies: 'studies',
  members: 'members',
  memberSession: 'memberSession',
};

function App() {
  const [view, setView] = useState(VIEWS.home);
  const [currentMember, setCurrentMember] = useState(() => {
    try {
      return localStorage.getItem(CURRENT_MEMBER_KEY) || '';
    } catch {
      return '';
    }
  });
  const [memberSessionTab, setMemberSessionTab] = useState(null);
  const [scheduleFilter, setScheduleFilter] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [attendanceItem, setAttendanceItem] = useState(null);

  const { schedules, add, remove, filteredByMember, updateAttendance, updateExerciseDone } =
    useSchedules();

  useEffect(() => {
    try {
      if (currentMember) localStorage.setItem(CURRENT_MEMBER_KEY, currentMember);
      else localStorage.removeItem(CURRENT_MEMBER_KEY);
    } catch {}
  }, [currentMember]);

  const goHome = () => {
    setView(VIEWS.home);
    setMemberSessionTab(null);
  };
  const openSchedule = () => setView(VIEWS.schedule);
  const openStudies = () => setView(VIEWS.studies);
  const openMembers = () => setView(VIEWS.members);

  const openMemberSession = (memberName, studyId = null) => {
    setCurrentMember(memberName);
    setMemberSessionTab(studyId);
    setView(VIEWS.memberSession);
  };

  const openMemberSchedule = (memberName) => {
    setCurrentMember(memberName);
    setScheduleFilter('mine');
    setView(VIEWS.schedule);
  };

  const displaySchedules =
    scheduleFilter === 'mine' && currentMember
      ? filteredByMember(currentMember)
      : schedules;

  return (
    <div className="app">
      <Header
        view={view}
        onGoHome={goHome}
        currentMember={currentMember}
        onCurrentMemberChange={setCurrentMember}
        members={MEMBERS}
      />

      {view === VIEWS.home && (
        <Home
          currentMember={currentMember}
          onCurrentMemberChange={setCurrentMember}
          members={MEMBERS}
          schedules={schedules}
          onOpenMemberSession={openMemberSession}
          onAttendanceClick={(item) => setAttendanceItem(item)}
          onOpenSchedule={openSchedule}
        />
      )}

      {view === VIEWS.memberSession && currentMember && (
        <MemberSessionView
          memberName={currentMember}
          schedules={schedules}
          onGoHome={goHome}
          onAddSchedule={(data) => add(data)}
          onRemoveSchedule={remove}
          onAttendanceClick={(item) => setAttendanceItem(item)}
          updateAttendance={updateAttendance}
          updateExerciseDone={updateExerciseDone}
          members={MEMBERS}
          initialStudyTab={memberSessionTab}
        />
      )}

      {view === VIEWS.schedule && (
        <SchedulePanel
          schedules={displaySchedules}
          scheduleFilter={scheduleFilter}
          onFilterChange={setScheduleFilter}
          currentMember={currentMember}
          onAddClick={() => setModalOpen(true)}
          onRemove={remove}
          onAttendanceClick={(item) => setAttendanceItem(item)}
          updateAttendance={updateAttendance}
        />
      )}

      {view === VIEWS.studies && <StudiesPanel />}
      {view === VIEWS.members && (
        <MembersPanel members={MEMBERS} onMemberClick={openMemberSchedule} />
      )}

      <footer className="footer">
        <p>스터디 허브 · 창민석 · 이윤지 · 송수현 · 강태영 · 조수민 · 신현호</p>
      </footer>

      <ScheduleForm
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={(data) => {
          add(data);
          setModalOpen(false);
        }}
      />

      {attendanceItem && (
        <AttendanceModal
          isOpen={!!attendanceItem}
          onClose={() => setAttendanceItem(null)}
          sessionLabel={
            (STUDIES.find((s) => s.id === attendanceItem.studyId)?.name || attendanceItem.studyId) +
            ' · ' +
            formatDate(attendanceItem.date)
          }
          members={MEMBERS}
          attendance={attendanceItem.attendance || []}
          onSave={(attendance) => {
            updateAttendance(attendanceItem.id, attendance);
            setAttendanceItem(null);
          }}
        />
      )}
    </div>
  );
}

export default App;
