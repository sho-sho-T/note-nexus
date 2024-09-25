CREATE TABLE NOTE_CATEGORIES (
    note_id INTEGER NOT NULL,
    category_id INTEGER NOT NULL,
    PRIMARY KEY (note_id, category_id),
    FOREIGN KEY (note_id) REFERENCES NOTES(id),
    FOREIGN KEY (category_id) REFERENCES CATEGORIES(id)
);