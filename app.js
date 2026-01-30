const MEMBERS = ['창민석', '이윤지', '송수현', '강태영', '조수민', '신현호'];

const STUDIES = [
  {
    id: 'paper',
    name: '논문 스터디',
    desc: '페이퍼 읽고 발표·토론',
    icon: '📄',
    accent: 'accent-1',
  },
  {
    id: 'exercise',
    name: '운동',
    desc: '함께 루틴·러닝 등',
    icon: '💪',
    accent: 'accent-2',
  },
  {
    id: 'reading',
    name: '독서 스터디',
    desc: '책 읽고 정리·토론',
    icon: '📚',
    accent: 'accent-3',
  },
  {
    id: 'research',
    name: '연구',
    desc: '과제·프로젝트 협업',
    icon: '🔬',
    accent: 'accent-1',
  },
];

const STORAGE_KEY = 'study-hub-schedule';

function getSchedules() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function setSchedules(list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

function renderMembers() {
  const el = document.getElementById('membersList');
  el.innerHTML = MEMBERS.map(
    (name) => `<span class="member-chip">${escapeHtml(name)}</span>`
  ).join('');
}

function renderStudies() {
  const el = document.getElementById('studiesGrid');
  el.innerHTML = STUDIES.map(
    (s) => `
      <article class="study-card ${s.accent}">
        <div class="study-icon">${s.icon}</div>
        <div class="study-name">${escapeHtml(s.name)}</div>
        <div class="study-desc">${escapeHtml(s.desc)}</div>
      </article>
    `
  ).join('');
}

function formatDate(dateStr) {
  const d = new Date(dateStr + 'T12:00:00');
  const month = d.getMonth() + 1;
  const day = d.getDate();
  const week = ['일', '월', '화', '수', '목', '금', '토'][d.getDay()];
  return `${month}/${day} (${week})`;
}

function renderSchedules() {
  const list = getSchedules();
  const el = document.getElementById('scheduleList');

  if (list.length === 0) {
    el.innerHTML = '<div class="schedule-empty">등록된 일정이 없어요. 아래에서 추가해 보세요.</div>';
    return;
  }

  const sorted = [...list].sort((a, b) => {
    const da = a.date + (a.time || '');
    const db = b.date + (b.time || '');
    return da.localeCompare(db);
  });

  el.innerHTML = sorted
    .map((item) => {
      const study = STUDIES.find((s) => s.id === item.studyId);
      const name = study ? study.name : item.studyId;
      return `
        <div class="schedule-item" data-id="${escapeHtml(item.id)}">
          <span class="schedule-date">${formatDate(item.date)}</span>
          <span class="schedule-time">${escapeHtml(item.time || '')}</span>
          <span class="schedule-study">${escapeHtml(name)}</span>
          ${item.note ? `<span class="schedule-note">${escapeHtml(item.note)}</span>` : ''}
          <button type="button" class="schedule-delete" aria-label="삭제">×</button>
        </div>
      `;
    })
    .join('');

  el.querySelectorAll('.schedule-delete').forEach((btn) => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.schedule-item');
      const id = item?.dataset?.id;
      if (id) {
        const next = getSchedules().filter((s) => s.id !== id);
        setSchedules(next);
        renderSchedules();
      }
    });
  });
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function openModal() {
  document.getElementById('modalOverlay').classList.add('is-open');
  const form = document.getElementById('scheduleForm');
  const select = form.querySelector('select[name="studyId"]');
  select.innerHTML = STUDIES.map(
    (s) => `<option value="${s.id}">${s.name}</option>`
  ).join('');
  const today = new Date().toISOString().slice(0, 10);
  form.querySelector('input[name="date"]').value = today;
}

function closeModal() {
  document.getElementById('modalOverlay').classList.remove('is-open');
}

document.getElementById('addScheduleBtn').addEventListener('click', openModal);
document.getElementById('modalClose').addEventListener('click', closeModal);
document.getElementById('modalCancel').addEventListener('click', closeModal);
document.getElementById('modalOverlay').addEventListener('click', (e) => {
  if (e.target.id === 'modalOverlay') closeModal();
});

document.getElementById('scheduleForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const form = e.target;
  const list = getSchedules();
  const newItem = {
    id: 'id-' + Date.now(),
    studyId: form.studyId.value,
    date: form.date.value,
    time: form.time.value,
    note: form.note.value.trim(),
  };
  setSchedules([...list, newItem]);
  renderSchedules();
  closeModal();
  form.reset();
});

renderMembers();
renderStudies();
renderSchedules();
