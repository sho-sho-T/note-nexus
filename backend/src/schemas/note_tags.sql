CREATE TABLE NOTE_TAGS (
    note_id INTEGER NOT NULL,
    tag_id INTEGER NOT NULL,
    PRIMARY KEY (note_id, tag_id),
    FOREIGN KEY (note_id) REFERENCES NOTES(id),
    FOREIGN KEY (tag_id) REFERENCES TAGS(id)
);