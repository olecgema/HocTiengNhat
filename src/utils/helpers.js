// Robust speak() that works on mobile (iOS/Android)
export const getJapaneseVoice = () => {
    if (!window.speechSynthesis) return null;
    const voices = window.speechSynthesis.getVoices();
    // Prefer ja-JP, then ja, then any voice
    return (
        voices.find(v => v.lang === 'ja-JP') ||
        voices.find(v => v.lang.startsWith('ja')) ||
        voices[0] ||
        null
    );
};

export const speak = (text) => {
    if (!window.speechSynthesis) return;

    // Cancel any currently playing speech (critical on iOS)
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ja-JP';
    utterance.rate = 0.85;
    utterance.pitch = 1;

    const doSpeak = () => {
        const voice = getJapaneseVoice();
        if (voice) utterance.voice = voice;
        window.speechSynthesis.speak(utterance);
    };

    // On mobile, voices may not be loaded yet — wait for them
    if (window.speechSynthesis.getVoices().length === 0) {
        window.speechSynthesis.addEventListener('voiceschanged', doSpeak, { once: true });
    } else {
        doSpeak();
    }
};

// Unlock audio on iOS with a silent tap
export const unlockAudio = () => {
    if (!window.speechSynthesis) return;
    const utterance = new SpeechSynthesisUtterance('');
    utterance.volume = 0;
    utterance.lang = 'ja-JP';
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
};
