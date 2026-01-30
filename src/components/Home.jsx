import { useMemo } from 'react';

function Home({ currentMember, onCurrentMemberChange, members, onWorkout, onPaperStudy }) {
  const hasMember = Boolean(currentMember);

  return (
    <main className="home home--simple">
      <section className="home-hero">
        <h1 className="home-hero__title">스터디 허브</h1>
        <p className="home-hero__sub">운동 · 논문 스터디</p>
      </section>

      <section className="home-section home-section--selector">
        <label className="home-label">나는</label>
        <select
          value={currentMember}
          onChange={(e) => onCurrentMemberChange(e.target.value)}
          aria-label="참여자 선택"
          className="home-select"
        >
          <option value="">선택</option>
          {members.map((name) => (
            <option key={name} value={name}>{name}</option>
          ))}
        </select>
      </section>

      <section className="home-section home-section--cards">
        <div className="home-cards">
          <button
            type="button"
            className="home-card home-card--workout"
            onClick={() => hasMember && onWorkout(currentMember)}
            disabled={!hasMember}
            title={!hasMember ? '먼저 참여자를 선택하세요' : '운동'}
          >
            <span className="home-card__icon">💪</span>
            <span className="home-card__label">운동</span>
            <span className="home-card__desc">출석 · 시작/종료 시간</span>
          </button>
          <button
            type="button"
            className="home-card home-card--paper"
            onClick={() => hasMember && onPaperStudy(currentMember)}
            disabled={!hasMember}
            title={!hasMember ? '먼저 참여자를 선택하세요' : '논문 스터디'}
          >
            <span className="home-card__icon">📄</span>
            <span className="home-card__label">논문 스터디</span>
            <span className="home-card__desc">읽은 논문 · 리뷰 등록</span>
          </button>
        </div>
      </section>

      {!hasMember && (
        <p className="home-hint-single">위에서 참여자를 선택하면 운동·논문 스터디를 이용할 수 있어요.</p>
      )}
    </main>
  );
}

export default Home;
