import { useState } from 'react';

function PaperStudyView({ memberName, onGoHome, papers, addPaper, addReview, getByReader }) {
  const [modal, setModal] = useState(null);
  const [reviewPaperId, setReviewPaperId] = useState(null);
  const [reviewText, setReviewText] = useState('');

  const myPapers = getByReader(memberName);

  const handleAddPaper = (e) => {
    e.preventDefault();
    const form = e.target;
    const title = form.title?.value?.trim();
    const link = form.link?.value?.trim();
    if (title) {
      addPaper({ title, link, reader: memberName });
      setModal(null);
      form.reset();
    }
  };

  const handleAddReview = (e) => {
    e.preventDefault();
    if (reviewPaperId && reviewText.trim()) {
      addReview(reviewPaperId, memberName, reviewText.trim());
      setReviewPaperId(null);
      setReviewText('');
    }
  };

  return (
    <section className="panel paper-study-view">
      <div className="paper-study-view__header">
        <h2 className="paper-study-view__title">논문 스터디</h2>
        <p className="paper-study-view__desc">읽은 논문을 등록하고 리뷰를 남겨보세요.</p>
      </div>

      <div className="paper-study-view__actions">
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => setModal('add')}
        >
          + 논문 등록
        </button>
      </div>

      <h3 className="subsection-label">내가 읽은 논문</h3>
      {myPapers.length === 0 ? (
        <p className="empty-hint">아직 등록한 논문이 없어요. 논문 등록을 눌러 추가하세요.</p>
      ) : (
        <ul className="paper-list">
          {myPapers.map((paper) => (
            <li key={paper.id} className="paper-item">
              <div className="paper-item__main">
                <span className="paper-item__title">{paper.title}</span>
                {paper.link && (
                  <a
                    href={paper.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="paper-item__link"
                  >
                    링크
                  </a>
                )}
              </div>
              <div className="paper-item__reviews">
                {paper.reviews?.length > 0 ? (
                  paper.reviews.map((r, i) => (
                    <div key={i} className="paper-review">
                      <span className="paper-review__author">{r.memberName}</span>
                      <p className="paper-review__content">{r.content}</p>
                    </div>
                  ))
                ) : (
                  <span className="paper-item__no-review">리뷰 없음</span>
                )}
              </div>
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={() => setReviewPaperId(paper.id)}
              >
                리뷰 등록
              </button>
            </li>
          ))}
        </ul>
      )}

      {modal === 'add' && (
        <div
          className="modal-overlay is-open"
          onClick={(e) => e.target === e.currentTarget && setModal(null)}
        >
          <div className="modal">
            <div className="modal-header">
              <h3>논문 등록</h3>
              <button type="button" className="modal-close" onClick={() => setModal(null)}>×</button>
            </div>
            <form className="modal-form" onSubmit={handleAddPaper}>
              <label>
                <span>제목</span>
                <input type="text" name="title" placeholder="논문 제목" required />
              </label>
              <label>
                <span>링크 (선택)</span>
                <input type="url" name="link" placeholder="https://..." />
              </label>
              <div className="modal-actions">
                <button type="button" className="btn btn-ghost" onClick={() => setModal(null)}>취소</button>
                <button type="submit" className="btn btn-primary">등록</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {reviewPaperId && (
        <div
          className="modal-overlay is-open"
          onClick={(e) => e.target === e.currentTarget && setReviewPaperId(null)}
        >
          <div className="modal">
            <div className="modal-header">
              <h3>리뷰 등록</h3>
              <button type="button" className="modal-close" onClick={() => setReviewPaperId(null)}>×</button>
            </div>
            <form className="modal-form" onSubmit={handleAddReview}>
              <label>
                <span>리뷰</span>
                <textarea
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="논문에 대한 리뷰를 작성하세요."
                  rows={4}
                  className="paper-review-textarea"
                />
              </label>
              <div className="modal-actions">
                <button type="button" className="btn btn-ghost" onClick={() => setReviewPaperId(null)}>취소</button>
                <button type="submit" className="btn btn-primary" disabled={!reviewText.trim()}>등록</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}

export default PaperStudyView;
