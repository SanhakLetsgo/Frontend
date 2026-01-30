import { useState, useCallback } from 'react';

const STORAGE_KEY = 'study-hub-papers';

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const list = raw ? JSON.parse(raw) : [];
    return list.map((p) => ({ ...p, reviews: p.reviews || [] }));
  } catch {
    return [];
  }
}

function save(list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

export function usePapers() {
  const [papers, setPapers] = useState(load);

  const addPaper = useCallback(({ title, link, reader }) => {
    const paper = {
      id: 'paper-' + Date.now(),
      title: (title || '').trim(),
      link: (link || '').trim(),
      reader: reader || '',
      createdAt: new Date().toISOString(),
      reviews: [],
    };
    setPapers((prev) => {
      const next = [paper, ...prev];
      save(next);
      return next;
    });
    return paper;
  }, []);

  const addReview = useCallback((paperId, memberName, content) => {
    const review = {
      memberName,
      content: (content || '').trim(),
      createdAt: new Date().toISOString(),
    };
    setPapers((prev) => {
      const next = prev.map((p) =>
        p.id === paperId ? { ...p, reviews: [...(p.reviews || []), review] } : p
      );
      save(next);
      return next;
    });
  }, []);

  const getByReader = useCallback(
    (memberName) => papers.filter((p) => p.reader === memberName),
    [papers]
  );

  return { papers, addPaper, addReview, getByReader };
}
