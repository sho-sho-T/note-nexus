INSERT INTO USERS (username, password_hash) VALUES 
('test', 'password');

INSERT INTO NOTES (user_id, cue, content, summary) VALUES 
(1, 'First Note', 'This is the content of my first note.', 'Summary of first note');

INSERT INTO CATEGORIES (user_id, name) VALUES 
(1, 'Ruby');

INSERT INTO TAGS (user_id, name) VALUES 
(1, '重要');

INSERT INTO NOTE_CATEGORIES (note_id, category_id) VALUES 
(1, 1);

INSERT INTO NOTE_TAGS (note_id, tag_id) VALUES 
(1, 1);