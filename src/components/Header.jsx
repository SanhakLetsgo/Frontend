function Header({ view, onGoHome, currentMember, onCurrentMemberChange, members }) {
  const isHome = view === 'home';

  return (
    <header className="header">
      <div className="header-inner">
        <div className="header-left">
          {!isHome ? (
            <button type="button" className="btn-back" onClick={onGoHome} aria-label="홈으로">
              ← 홈
            </button>
          ) : (
            <a href="#" className="logo" onClick={(e) => { e.preventDefault(); onGoHome(); }} aria-label="스터디 허브">
              <span className="logo-icon">◆</span>
              스터디 허브
            </a>
          )}
          {isHome && (
            <p className="tagline">운동 · 논문 스터디</p>
          )}
        </div>
        <div className="member-picker">
          <span>나는</span>
          <select
            value={currentMember}
            onChange={(e) => onCurrentMemberChange(e.target.value)}
            aria-label="참여자 선택"
          >
            <option value="">선택</option>
            {members.map((name) => (
              <option key={name} value={name}>{name}</option>
            ))}
          </select>
        </div>
      </div>
    </header>
  );
}

export default Header;
