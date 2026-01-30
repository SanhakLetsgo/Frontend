import { useState, useEffect } from 'react';
import { MEMBERS, CURRENT_MEMBER_KEY } from './data/constants';
import { useDailyCheckIns } from './hooks/useDailyCheckIns';
import { useWorkoutLogs } from './hooks/useWorkoutLogs';
import { usePapers } from './hooks/usePapers';
import Header from './components/Header';
import Home from './components/Home';
import WorkoutView from './components/WorkoutView';
import PaperStudyView from './components/PaperStudyView';

const VIEWS = { home: 'home', workout: 'workout', paperStudy: 'paperStudy' };

function App() {
  const [view, setView] = useState(VIEWS.home);
  const [currentMember, setCurrentMember] = useState(() => {
    try {
      return localStorage.getItem(CURRENT_MEMBER_KEY) || '';
    } catch {
      return '';
    }
  });

  const dailyCheckIn = useDailyCheckIns();
  const workoutLogs = useWorkoutLogs();
  const papers = usePapers();

  useEffect(() => {
    try {
      if (currentMember) localStorage.setItem(CURRENT_MEMBER_KEY, currentMember);
      else localStorage.removeItem(CURRENT_MEMBER_KEY);
    } catch {}
  }, [currentMember]);

  const goHome = () => setView(VIEWS.home);
  const openWorkout = () => setView(VIEWS.workout);
  const openPaperStudy = () => setView(VIEWS.paperStudy);

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
          onWorkout={openWorkout}
          onPaperStudy={openPaperStudy}
        />
      )}

      {view === VIEWS.workout && currentMember && (
        <WorkoutView
          memberName={currentMember}
          onGoHome={goHome}
          dailyCheckIn={dailyCheckIn}
          workoutLogs={workoutLogs}
        />
      )}

      {view === VIEWS.paperStudy && currentMember && (
        <PaperStudyView
          memberName={currentMember}
          onGoHome={goHome}
          papers={papers.papers}
          addPaper={papers.addPaper}
          addReview={papers.addReview}
          getByReader={papers.getByReader}
        />
      )}

      <footer className="footer">
        <p>스터디 허브 · 운동 · 논문 스터디</p>
      </footer>
    </div>
  );
}

export default App;
