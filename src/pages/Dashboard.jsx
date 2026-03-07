import { useState, useEffect, useRef } from 'react';
import { supabase } from '../services/api';
import { useAuth } from '../hooks/useAuth';
import { speak } from '../utils/helpers';
import Card from '../components/Card';
import Button from '../components/Button';

export default function Dashboard() {
    const { session } = useAuth();

    const [view, setView] = useState('MENU'); // MENU, BROWSE, QUIZ, RESULTS
    const [mistakesMap, setMistakesMap] = useState(new Map());

    // App Data (from Supabase)
    const [characterData, setCharacterData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentType, setCurrentType] = useState('hiragana');
    const [quizLength, setQuizLength] = useState(10);

    // Quiz State
    const [isReviewMode, setIsReviewMode] = useState(false);
    const [quizPool, setQuizPool] = useState([]);
    const [currentIdx, setCurrentIdx] = useState(0);
    const [score, setScore] = useState(0);
    const [sessionMistakes, setSessionMistakes] = useState([]);

    // Interactions
    const [inputValue, setInputValue] = useState('');
    const [feedback, setFeedback] = useState(null);
    const [flash, setFlash] = useState(false);
    const [charStatus, setCharStatus] = useState(null);

    // Examples Modal
    const [examplesModal, setExamplesModal] = useState(null);
    const [examplesLoading, setExamplesLoading] = useState(false);

    // Inline hint per mistake (keyed by char)
    const [inlineHints, setInlineHints] = useState({});

    const inputRef = useRef(null);

    useEffect(() => {
        const fetchCharacters = async () => {
            try {
                const { data, error } = await supabase
                    .from('characters')
                    .select('*');

                if (error) {
                    console.error("Supabase API error:", error);
                    return;
                }

                if (data && data.length > 0) {
                    const formatted = data.map(item => ({
                        char: item.character_symbol,
                        romaji: item.romaji,
                        type: item.type
                    }));
                    setCharacterData(formatted);
                }
            } catch (e) {
                console.error("Fetch characters failed:", e.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCharacters();

        // Preload voices for mobile (especially Android)
        const loadVoices = () => window.speechSynthesis.getVoices();
        loadVoices();
        if (window.speechSynthesis.onvoiceschanged !== undefined) {
            window.speechSynthesis.addEventListener('voiceschanged', loadVoices, { once: true });
        }
    }, []);

    // Fetch mistakes from DB when session changes
    useEffect(() => {
        const fetchUserMistakes = async () => {
            if (!session) {
                setMistakesMap(new Map());
                return;
            }
            try {
                const { data, error } = await supabase
                    .from('user_mistakes')
                    .select('char, romaji, type')
                    .eq('user_id', session.user.id);

                if (error) {
                    console.error("Error fetching user mistakes:", error);
                    return;
                }

                const map = new Map();
                if (data) {
                    data.forEach(item => map.set(item.char, item));
                }
                setMistakesMap(map);
            } catch (err) {
                console.error("Fetch user mistakes failed:", err.message);
            }
        };

        fetchUserMistakes();
    }, [session]);

    const syncLocalMapForUI = (newMap) => {
        setMistakesMap(newMap);
    };

    const startQuiz = (reviewMode) => {
        setIsReviewMode(reviewMode);
        setScore(0);
        setCurrentIdx(0);
        setSessionMistakes([]);
        setFeedback(null);
        setInputValue('');
        setCharStatus(null);

        let pool = [];
        const typeData = characterData.filter(item => item.type === currentType);

        if (reviewMode) {
            pool = Array.from(mistakesMap.values()).filter(item => item.type === currentType);
            pool.sort(() => Math.random() - 0.5);
        } else {
            const shuffled = [...typeData].sort(() => Math.random() - 0.5);
            pool = shuffled.slice(0, Math.min(quizLength, shuffled.length));
        }

        setQuizPool(pool);
        setView('QUIZ');
    };

    const fetchRandomExample = async (char) => {
        setInlineHints(prev => ({ ...prev, [char]: { loading: true, example: null } }));
        try {
            const { data, error } = await supabase
                .from('examples')
                .select('*')
                .like('hiragana', `%${char}%`);

            if (error || !data || data.length === 0) {
                setInlineHints(prev => ({ ...prev, [char]: { loading: false, example: null } }));
            } else {
                const random = data[Math.floor(Math.random() * data.length)];
                setInlineHints(prev => ({ ...prev, [char]: { loading: false, example: random } }));
            }
        } catch (e) {
            setInlineHints(prev => ({ ...prev, [char]: { loading: false, example: null } }));
        }
    };

    const openExamples = async (item) => {
        setExamplesModal({ char: item.char, romaji: item.romaji, examples: [] });
        setExamplesLoading(true);

        try {
            const { data, error } = await supabase
                .from('examples')
                .select('*')
                .like('hiragana', `%${item.char}%`);

            if (error) {
                console.error("Fetch examples error:", error);
                setExamplesModal(prev => ({ ...prev, examples: [] }));
            } else {
                setExamplesModal(prev => ({ ...prev, examples: data || [] }));
            }
        } catch (e) {
            console.error("Examples fetch failed:", e.message);
        } finally {
            setExamplesLoading(false);
        }
    };

    const closeExamples = () => {
        setExamplesModal(null);
        setExamplesLoading(false);
    };

    useEffect(() => {
        if (view === 'QUIZ' && inputRef.current && !feedback) {
            inputRef.current.focus();
        }
    }, [view, currentIdx, feedback]);

    const checkAnswer = async () => {
        if (!inputValue.trim() || feedback) return;

        const currentItem = quizPool[currentIdx];
        const isCorrect = inputValue.trim().toLowerCase() === currentItem.romaji;

        setFeedback({
            type: isCorrect ? 'correct' : 'incorrect',
            text: isCorrect ? 'Tuyệt vời!' : `Sai rồi. Đáp án là: "${currentItem.romaji}"`
        });

        speak(currentItem.char);

        if (isCorrect) {
            setScore(s => s + 1);
            setCharStatus('success');

            if (session) {
                const newMap = new Map(mistakesMap);
                if (newMap.has(currentItem.char)) {
                    newMap.delete(currentItem.char);
                    syncLocalMapForUI(newMap);
                    supabase
                        .from('user_mistakes')
                        .delete()
                        .eq('user_id', session.user.id)
                        .eq('char', currentItem.char)
                        .then(({ error }) => {
                            if (error) console.error("Error deleting mistake:", error);
                        });
                }
            }
        } else {
            setCharStatus('shake');
            setSessionMistakes(prev => [...prev, currentItem]);

            if (session) {
                const newMap = new Map(mistakesMap);
                if (!newMap.has(currentItem.char)) {
                    newMap.set(currentItem.char, currentItem);
                    syncLocalMapForUI(newMap);
                    supabase
                        .from('user_mistakes')
                        .upsert({
                            user_id: session.user.id,
                            char: currentItem.char,
                            romaji: currentItem.romaji,
                            type: currentItem.type
                        }, { onConflict: 'user_id, char' })
                        .then(({ error }) => {
                            if (error) console.error("Error inserting mistake:", error);
                        });
                }
            }

            setFlash(true);
            setTimeout(() => setFlash(false), 500);
        }

        setTimeout(() => {
            if (currentIdx + 1 >= quizPool.length) {
                setView('RESULTS');
            } else {
                setCurrentIdx(i => i + 1);
                setInputValue('');
                setFeedback(null);
                setCharStatus(null);
            }
        }, 1200);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') checkAnswer();
    };

    const clearMistakes = async () => {
        if (window.confirm("Bạn có chắc chắn muốn xóa toàn bộ từ sai đã lưu không?")) {
            setMistakesMap(new Map());
            if (session) {
                const { error } = await supabase
                    .from('user_mistakes')
                    .delete()
                    .eq('user_id', session.user.id);
                if (error) {
                    console.error("Error clearing mistakes:", error);
                    alert("Có lỗi xảy ra khi xóa danh sách từ sai trên máy chủ.");
                }
            }
        }
    };

    const currentTypeData = characterData.filter(item => item.type === currentType);
    const currentMistakesCount = Array.from(mistakesMap.values()).filter(item => item.type === currentType).length;

    return (
        <>
            {/* ===== MENU VIEW ===== */}
            {view === 'MENU' && (
                <Card className="view menu-card">
                    <h2>Chọn chế độ học</h2>

                    <div className="type-selector">
                        <Button
                            className={`btn-tab ${currentType === 'hiragana' ? 'active' : ''}`}
                            onClick={() => setCurrentType('hiragana')}
                            variant="text"
                        >
                            Hiragana
                        </Button>
                        <Button
                            className={`btn-tab ${currentType === 'katakana' ? 'active' : ''}`}
                            onClick={() => setCurrentType('katakana')}
                            variant="text"
                        >
                            Katakana
                        </Button>
                    </div>

                    {isLoading ? (
                        <Button className="pulse-btn" variant="secondary" disabled>
                            <i className="fa-solid fa-spinner fa-spin"></i> Đang tải dữ liệu...
                        </Button>
                    ) : (
                        <Button
                            onClick={() => startQuiz(false)}
                            className="pulse-btn"
                            disabled={currentTypeData.length === 0}
                        >
                            <i className="fa-solid fa-play"></i> Bắt đầu Quiz
                        </Button>
                    )}

                    <div className="quiz-settings">
                        <label htmlFor="quiz-length">Số câu hỏi mỗi bài:</label>
                        <select
                            id="quiz-length"
                            value={quizLength}
                            onChange={(e) => setQuizLength(Number(e.target.value))}
                            className="settings-select"
                        >
                            <option value={10}>10 câu</option>
                            <option value={20}>20 câu</option>
                            <option value={30}>30 câu</option>
                            <option value={46}>Toàn bộ bảng chữ</option>
                        </select>
                    </div>

                    <div className="stats-container">
                        <p>Số từ đang sai: <span className="mistake-count">{currentMistakesCount}</span> / {currentTypeData.length || 46}</p>
                        {mistakesMap.size > 0 && (
                            <Button
                                onClick={clearMistakes}
                                className="btn-clear"
                                variant="text"
                            >
                                Xóa lịch sử lỗi
                            </Button>
                        )}
                    </div>

                    <Button
                        onClick={() => startQuiz(true)}
                        variant="secondary"
                        disabled={currentMistakesCount === 0 || isLoading}
                    >
                        <i className="fa-solid fa-book-open"></i> Ôn tập ({currentMistakesCount})
                    </Button>

                    <button
                        onClick={() => setView('BROWSE')}
                        className="btn btn-outline-accent mt-3"
                        disabled={isLoading || currentTypeData.length === 0}
                    >
                        <i className="fa-solid fa-table-cells"></i> Xem bảng chữ & Ví dụ
                    </button>
                </Card>
            )}

            {/* ===== BROWSE VIEW - Bảng chữ cái với nút Ví dụ ===== */}
            {view === 'BROWSE' && (
                <Card className="view browse-card">
                    <div className="browse-header">
                        <button onClick={() => setView('MENU')} className="btn-icon">
                            <i className="fa-solid fa-arrow-left"></i>
                        </button>
                        <h2>
                            {currentType === 'hiragana' ? 'Bảng Hiragana' : 'Bảng Katakana'}
                        </h2>
                        <div className="type-selector-mini">
                            <button
                                className={`btn-tab-mini ${currentType === 'hiragana' ? 'active' : ''}`}
                                onClick={() => setCurrentType('hiragana')}
                            >H</button>
                            <button
                                className={`btn-tab-mini ${currentType === 'katakana' ? 'active' : ''}`}
                                onClick={() => setCurrentType('katakana')}
                            >K</button>
                        </div>
                    </div>

                    <div className="char-grid">
                        {currentTypeData.map((item, idx) => (
                            <div
                                key={idx}
                                className={`char-card ${mistakesMap.has(item.char) ? 'is-mistake' : ''}`}
                            >
                                <span className="char-symbol">{item.char}</span>
                                <span className="char-romaji">{item.romaji}</span>
                                <div className="char-actions">
                                    <button
                                        className="btn-speak-mini"
                                        onClick={() => speak(item.char)}
                                        title="Nghe phát âm"
                                    >
                                        <i className="fa-solid fa-volume-high"></i>
                                    </button>
                                    <button
                                        className="btn-example"
                                        onClick={() => openExamples(item)}
                                        title="Xem ví dụ"
                                    >
                                        <i className="fa-solid fa-book"></i> Ví dụ
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            )}

            {/* ===== QUIZ VIEW ===== */}
            {view === 'QUIZ' && quizPool.length > 0 && (
                <Card className="view quiz-card">
                    <div className="quiz-header">
                        <button onClick={() => setView('MENU')} className="btn-icon">
                            <i className="fa-solid fa-arrow-left"></i>
                        </button>
                        <span className="quiz-progress">Câu {currentIdx + 1}/{quizPool.length}</span>
                        <span className={`badge ${isReviewMode ? 'review' : ''}`}>
                            {isReviewMode ? 'Ôn tập lỗi sai' : 'Quiz Mới'}
                        </span>
                    </div>

                    <div className={`character-display ${charStatus || ''}`}>
                        <span className="japanese-char">{quizPool[currentIdx].char}</span>
                        <button
                            className="btn-icon btn-speak"
                            onClick={() => speak(quizPool[currentIdx].char)}
                            title="Nghe phát âm"
                        >
                            <i className="fa-solid fa-volume-high"></i>
                        </button>
                    </div>

                    <div className="input-section">
                        <p className="instruction">Nhập Romaji:</p>
                        <div className="input-wrapper">
                            <input
                                id="answer-input"
                                ref={inputRef}
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyDown={handleKeyDown}
                                disabled={!!feedback}
                                placeholder="Ví dụ: a, ka, sa..."
                                autoComplete="off"
                            />
                            <button onClick={checkAnswer} disabled={!!feedback} className="btn btn-submit">
                                <i className="fa-solid fa-check"></i>
                            </button>
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

            {/* ===== RESULTS VIEW ===== */}
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

                    {sessionMistakes.length > 0 && (
                        <div className="mistakes-summary">
                            <h3>Từ cần ôn tập:</h3>
                            <div className="mistake-tags">
                                {sessionMistakes.map((m, i) => {
                                    const hint = inlineHints[m.char];
                                    return (
                                        <div key={i} className={`mistake-tag-wrap ${hint?.example ? 'has-hint' : ''}`}>
                                            <div className="mistake-tag-row">
                                                <span className="mistake-tag">
                                                    <span className="mt-char">{m.char}</span>
                                                    <span className="mt-sep">—</span>
                                                    <span className="mt-romaji">{m.romaji}</span>
                                                </span>
                                                <button
                                                    className={`btn-hint ${hint?.loading ? 'loading' : ''}`}
                                                    onClick={() => fetchRandomExample(m.char)}
                                                    title="Gợi ý ví dụ"
                                                >
                                                    {hint?.loading
                                                        ? <i className="fa-solid fa-spinner fa-spin"></i>
                                                        : <i className="fa-solid fa-lightbulb"></i>
                                                    }
                                                </button>
                                            </div>
                                            {hint?.example && (
                                                <div className="inline-hint">
                                                    <span className="ih-word">{hint.example.hiragana}</span>
                                                    <span className="ih-romaji">{hint.example.romaji}</span>
                                                    <span className="ih-viet">{hint.example.vietnamese}</span>
                                                    <button className="ih-speak" onClick={() => speak(hint.example.hiragana)} title="Nghe">
                                                        <i className="fa-solid fa-volume-high"></i>
                                                    </button>
                                                </div>
                                            )}
                                            {hint && !hint.loading && !hint.example && (
                                                <div className="inline-hint-empty">Chưa có ví dụ</div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    <div className="results-actions">
                        <Button onClick={() => setView('MENU')} variant="secondary">Về Menu</Button>
                        {sessionMistakes.length > 0 && (
                            <Button onClick={() => startQuiz(true)} className="pulse-btn">Ôn lại ngay</Button>
                        )}
                    </div>
                </Card>
            )}

            {/* ===== EXAMPLES MODAL ===== */}
            {examplesModal && (
                <div className="modal-overlay" onClick={closeExamples}>
                    <Card className="modal-card" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <div className="modal-char-info">
                                <span className="modal-char">{examplesModal.char}</span>
                                <span className="modal-romaji">{examplesModal.romaji}</span>
                            </div>
                            <button className="btn-icon" onClick={closeExamples}>
                                <i className="fa-solid fa-xmark"></i>
                            </button>
                        </div>
                        <h3 className="modal-title">Ví dụ từ vựng</h3>

                        {examplesLoading ? (
                            <div className="modal-loading">
                                <i className="fa-solid fa-spinner fa-spin"></i>
                                <span>Đang tải ví dụ...</span>
                            </div>
                        ) : examplesModal.examples.length === 0 ? (
                            <div className="modal-empty">
                                <i className="fa-solid fa-face-meh"></i>
                                <p>Chưa có ví dụ nào cho chữ này.</p>
                                <p className="modal-empty-hint">Hãy thêm ví dụ vào bảng <code>examples</code> trong Supabase!</p>
                            </div>
                        ) : (
                            <div className="examples-list">
                                {examplesModal.examples.map((ex, i) => (
                                    <div key={i} className="example-item">
                                        <div className="example-top">
                                            <span className="example-hiragana">{ex.hiragana}</span>
                                            <button
                                                className="btn-speak-mini"
                                                onClick={() => speak(ex.hiragana)}
                                                title="Nghe phát âm"
                                            >
                                                <i className="fa-solid fa-volume-high"></i>
                                            </button>
                                        </div>
                                        <span className="example-romaji">{ex.romaji}</span>
                                        <span className="example-viet">{ex.vietnamese}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </Card>
                </div>
            )}

            {flash && <div className="flash-overlay flash"></div>}
        </>
    );
}
