import { useState, useEffect, useRef } from 'react';
import { supabase } from '../services/api';
import { useAuth } from '../hooks/useAuth';
import { speak } from '../utils/helpers';
import Card from '../components/Card';
import Button from '../components/Button';

export default function Phrases() {
    const { session } = useAuth();

    const [view, setView] = useState('MENU');
    const [phrases, setPhrases] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [isLoading, setIsLoading] = useState(true);

    // Quiz State
    const [quizPool, setQuizPool] = useState([]);
    const [currentIdx, setCurrentIdx] = useState(0);
    const [score, setScore] = useState(0);
    const [mistakes, setMistakes] = useState([]);

    const [inputValue, setInputValue] = useState('');
    const [feedback, setFeedback] = useState(null);
    const [flash, setFlash] = useState(false);
    const [charStatus, setCharStatus] = useState(null);
    const [hint, setHint] = useState(null); // Will hold the diff display
    const [isWaitingNext, setIsWaitingNext] = useState(false);

    const inputRef = useRef(null);
    const nextBtnRef = useRef(null);

    useEffect(() => {
        const fetchPhrases = async () => {
            try {
                const { data, error } = await supabase
                    .from('phrases')
                    .select('*');

                if (error) {
                    console.error("Supabase API error:", error);
                    return;
                }

                if (data && data.length > 0) {
                    setPhrases(data);
                    const uniqueCategories = [...new Set(data.map(p => p.category))].filter(Boolean);
                    setCategories(uniqueCategories);
                }
            } catch (e) {
                console.error("Fetch phrases failed:", e.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPhrases();

        const loadVoices = () => window.speechSynthesis.getVoices();
        loadVoices();
        if (window.speechSynthesis.onvoiceschanged !== undefined) {
            window.speechSynthesis.addEventListener('voiceschanged', loadVoices, { once: true });
        }
    }, []);

    const startQuiz = () => {
        setScore(0);
        setCurrentIdx(0);
        setMistakes([]);
        setFeedback(null);
        setInputValue('');
        setCharStatus(null);
        setHint(null);
        setIsWaitingNext(false);

        let filtered = phrases;
        if (selectedCategory !== 'All') {
            filtered = phrases.filter(p => p.category === selectedCategory);
        }

        if (filtered.length === 0) return;

        const pool = [...filtered].sort(() => Math.random() - 0.5);
        setQuizPool(pool);
        setView('QUIZ');
    };

    useEffect(() => {
        if (isWaitingNext && nextBtnRef.current) {
            nextBtnRef.current.focus();
        } else if (view === 'QUIZ' && inputRef.current && !feedback) {
            inputRef.current.focus();
        }
    }, [view, currentIdx, feedback, hint, isWaitingNext]);

    const handleNextQuestion = () => {
        if (currentIdx + 1 >= quizPool.length) {
            setView('RESULTS');
        } else {
            setCurrentIdx(i => i + 1);
            setInputValue('');
            setFeedback(null);
            setCharStatus(null);
            setHint(null);
            setIsWaitingNext(false);
        }
    };

    const renderHintWithDiff = (input, expected) => {
        const inputArr = input.split('');
        const expectedArr = expected.split('');
        const len = Math.max(inputArr.length, expectedArr.length);
        const result = [];

        for (let i = 0; i < len; i++) {
            if (i >= expectedArr.length) {
                result.push(<span key={i} className="diff-error">{inputArr[i]}</span>);
            } else if (i >= inputArr.length) {
                result.push(<span key={i} className="diff-missing" title={expectedArr[i]}>_</span>);
            } else {
                if (inputArr[i] !== expectedArr[i]) {
                    result.push(<span key={i} className="diff-error">{inputArr[i]}</span>);
                } else {
                    result.push(<span key={i} className="diff-correct">{inputArr[i]}</span>);
                }
            }
        }
        return <div className="hint-diff-container">Gợi ý lỗi của bạn: {result}</div>;
    };

    const checkAnswer = () => {
        if (!inputValue.trim() || feedback) return;

        const currentItem = quizPool[currentIdx];

        // Normalize multiple spaces and lowercase for checking
        const normalizedInput = inputValue.trim().toLowerCase().replace(/\s+/g, ' ');
        const expected = currentItem.romaji.trim().toLowerCase().replace(/\s+/g, ' ');

        const isCorrect = normalizedInput === expected;

        if (isCorrect) {
            setFeedback({
                type: 'correct',
                text: 'Tuyệt vời!'
            });
            speak(currentItem.japanese);
            if (!hint) setScore(s => s + 1); // Only score if no hint was used maybe? Or always score.
            setCharStatus('success');

            setTimeout(() => {
                handleNextQuestion();
            }, 1200);
        } else {
            setCharStatus('shake');
            setFlash(true);
            setTimeout(() => setFlash(false), 500);

            if (!hint) {
                // Lần 1 sai: Hiện gợi ý đỏ chữ sai
                setHint(renderHintWithDiff(normalizedInput, expected));
                setMistakes(prev => {
                    const alreadyHas = prev.find(m => m.id === currentItem.id);
                    if (!alreadyHas) return [...prev, currentItem];
                    return prev;
                });
                // Keep input value so they can fix it
            } else {
                // Lần 2 sai: Báo lỗi và qua câu
                setFeedback({
                    type: 'incorrect',
                    text: `Sai rồi. Đáp án là: "${currentItem.romaji}"`
                });
                speak(currentItem.japanese);
                setIsWaitingNext(true);
            }
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            if (isWaitingNext) {
                handleNextQuestion();
            } else {
                checkAnswer();
            }
        }
    };

    const currentTypeDataCount = selectedCategory === 'All'
        ? phrases.length
        : phrases.filter(p => p.category === selectedCategory).length;

    let placeholderPattern = "";
    if (view === 'QUIZ' && quizPool.length > 0) {
        placeholderPattern = quizPool[currentIdx].romaji.replace(/[^\s]/g, '_');
    }

    return (
        <div className="phrases-container">
            {view === 'MENU' && (
                <Card className="view menu-card">
                    <h2>Ôn Tập Câu & Từ Vựng</h2>

                    <div className="quiz-settings">
                        <label htmlFor="category-select">Chọn Chủ Đề:</label>
                        <select
                            id="category-select"
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="settings-select"
                        >
                            <option value="All">Tất cả ({phrases.length})</option>
                            {categories.map((cat, idx) => (
                                <option key={idx} value={cat}>
                                    {cat}
                                </option>
                            ))}
                        </select>
                    </div>

                    {isLoading ? (
                        <Button className="pulse-btn" variant="secondary" disabled>
                            <i className="fa-solid fa-spinner fa-spin"></i> Đang tải dữ liệu...
                        </Button>
                    ) : (
                        <Button
                            onClick={startQuiz}
                            className="pulse-btn"
                            disabled={currentTypeDataCount === 0}
                        >
                            <i className="fa-solid fa-play"></i> Bắt đầu Ôn Tập ({currentTypeDataCount} câu)
                        </Button>
                    )}
                </Card>
            )}

            {view === 'QUIZ' && quizPool.length > 0 && (
                <Card className="view quiz-card">
                    <div className="quiz-header">
                        <button onClick={() => setView('MENU')} className="btn-icon">
                            <i className="fa-solid fa-arrow-left"></i>
                        </button>
                        <span className="quiz-progress">Câu {currentIdx + 1}/{quizPool.length}</span>
                        <span className="badge">Chủ đề: {selectedCategory}</span>
                    </div>

                    <div className={`phrase-display ${charStatus || ''}`}>
                        <span className="japanese-phrase">{quizPool[currentIdx].japanese}</span>
                        <span className="vietnamese-meaning">{quizPool[currentIdx].meaning}</span>
                        <button
                            className="btn-icon btn-speak"
                            onClick={() => speak(quizPool[currentIdx].japanese)}
                            title="Nghe phát âm"
                        >
                            <i className="fa-solid fa-volume-high"></i>
                        </button>
                    </div>

                    <div className="input-section">
                        {hint && <div className="hint-wrapper">{hint}</div>}

                        <p className="instruction">Nhập Romaji:</p>
                        <div className="input-wrapper" style={{ background: 'none', border: 'none', padding: 0 }}>
                            <div className="phrases-input-wrapper">
                                <div className="phrases-placeholder">
                                    {placeholderPattern}
                                </div>
                                <input
                                    id="phrases-answer-input"
                                    className="phrases-input"
                                    ref={inputRef}
                                    type="text"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    disabled={!!feedback && !isWaitingNext}
                                    readOnly={isWaitingNext}
                                    autoComplete="off"
                                />
                            </div>
                            {isWaitingNext ? (
                                <button
                                    ref={nextBtnRef}
                                    onClick={handleNextQuestion}
                                    className="btn btn-submit"
                                    style={{ width: 'auto', padding: '0 20px', borderRadius: '25px', fontSize: '1.1rem' }}
                                >
                                    Tiếp tục
                                </button>
                            ) : (
                                <button onClick={checkAnswer} disabled={!!feedback} className="btn btn-submit">
                                    <i className="fa-solid fa-check"></i>
                                </button>
                            )}
                        </div>
                    </div>

                    {feedback && (
                        <div className={`feedback ${feedback.type}`}>
                            <span className="icon">
                                {feedback.type === 'correct' ? <i className="fa-solid fa-circle-check"></i> : <i className="fa-solid fa-circle-xmark"></i>}
                            </span>
                            <span className="text">{feedback.text}</span>
                        </div>
                    )}
                </Card>
            )}

            {view === 'RESULTS' && (
                <Card className="view results-card">
                    <h2>Kết quả</h2>
                    <div className="score-circle">
                        <svg viewBox="0 0 36 36" className={`circular-chart ${(score / quizPool.length) >= 0.8 ? 'score-excellent'
                            : (score / quizPool.length) >= 0.5 ? 'score-good' : 'score-bad'
                            }`}>
                            <path className="circle-bg"
                                d="M18 2.0845
                            a 15.9155 15.9155 0 0 1 0 31.831
                            a 15.9155 15.9155 0 0 1 0 -31.831"
                            />
                            <path className="circle"
                                strokeDasharray={`${quizPool.length ? Math.round((score / quizPool.length) * 100) : 0}, 100`}
                                d="M18 2.0845
                            a 15.9155 15.9155 0 0 1 0 31.831
                            a 15.9155 15.9155 0 0 1 0 -31.831"
                            />
                            <text x="18" y="20.35" className="percentage">
                                {quizPool.length ? Math.round((score / quizPool.length) * 100) : 0}%
                            </text>
                        </svg>
                    </div>
                    <p className="score-text">Đúng {score}/{quizPool.length} câu</p>

                    {mistakes.length > 0 && (
                        <div className="mistakes-summary">
                            <h3>Các câu/từ bạn đã sai:</h3>
                            <div className="mistake-list" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                {mistakes.map((m, i) => (
                                    <div key={i} className="mistake-tag-wrap" style={{ padding: '10px' }}>
                                        <div style={{ fontWeight: 'bold', fontSize: '1.2rem', color: '#fca5a5' }}>{m.japanese}</div>
                                        <div style={{ color: '#94a3b8', fontSize: '0.9rem' }}>{m.romaji}</div>
                                        <div style={{ color: '#fff' }}>{m.meaning}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="results-actions">
                        <Button onClick={() => setView('MENU')} variant="secondary">Về Menu</Button>
                        <Button onClick={startQuiz} className="pulse-btn">Làm lại bài này</Button>
                    </div>
                </Card>
            )}

            {flash && <div className="flash-overlay flash"></div>}
        </div>
    );
}
