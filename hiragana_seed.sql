CREATE TABLE IF NOT EXISTS characters (
    id INT AUTO_INCREMENT PRIMARY KEY,
    type VARCHAR(20) DEFAULT 'hiragana', -- Để phân biệt nếu sau này bạn thêm katakana/kanji
    character_symbol VARCHAR(10) NOT NULL,
    romaji VARCHAR(10) NOT NULL
);

INSERT INTO characters (type, character_symbol, romaji) VALUES
('hiragana', 'あ', 'a'), ('hiragana', 'い', 'i'), ('hiragana', 'う', 'u'), ('hiragana', 'え', 'e'), ('hiragana', 'お', 'o'),
('hiragana', 'か', 'ka'), ('hiragana', 'き', 'ki'), ('hiragana', 'く', 'ku'), ('hiragana', 'け', 'ke'), ('hiragana', 'こ', 'ko'),
('hiragana', 'さ', 'sa'), ('hiragana', 'し', 'shi'), ('hiragana', 'す', 'su'), ('hiragana', 'せ', 'se'), ('hiragana', 'そ', 'so'),
('hiragana', 'た', 'ta'), ('hiragana', 'ち', 'chi'), ('hiragana', 'つ', 'tsu'), ('hiragana', 'て', 'te'), ('hiragana', 'と', 'to'),
('hiragana', 'な', 'na'), ('hiragana', 'に', 'ni'), ('hiragana', 'ぬ', 'nu'), ('hiragana', 'ね', 'ne'), ('hiragana', 'の', 'no'),
('hiragana', 'は', 'ha'), ('hiragana', 'ひ', 'hi'), ('hiragana', 'ふ', 'fu'), ('hiragana', 'へ', 'he'), ('hiragana', 'ほ', 'ho'),
('hiragana', 'ま', 'ma'), ('hiragana', 'み', 'mi'), ('hiragana', 'む', 'mu'), ('hiragana', 'め', 'me'), ('hiragana', 'も', 'mo'),
('hiragana', 'や', 'ya'), ('hiragana', 'ゆ', 'yu'), ('hiragana', 'よ', 'yo'),
('hiragana', 'ら', 'ra'), ('hiragana', 'り', 'ri'), ('hiragana', 'る', 'ru'), ('hiragana', 'れ', 're'), ('hiragana', 'ろ', 'ro'),
('hiragana', 'わ', 'wa'), ('hiragana', 'を', 'wo'),
('hiragana', 'ん', 'n');
