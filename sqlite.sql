CREATE TABLE IF NOT EXISTS t_daten(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    datum_und_uhrzeit TEXT,
	systole INTEGER,
	diastole INTEGER,
	puls INTEGER,
    bemerkung TEXT
);

INSERT or IGNORE INTO t_daten(datum_und_uhrzeit, systole, diastole, puls, bemerkung) VALUES ('2020-09-05 14:45:00', 135, 72, 77, 'nach Schlaf auf dem Sofa');
INSERT or IGNORE INTO t_daten(datum_und_uhrzeit, systole, diastole, puls, bemerkung) VALUES ('2020-09-06 14:00:00', 141, 83, 79, 'keine');
INSERT or IGNORE INTO t_daten(datum_und_uhrzeit, systole, diastole, puls, bemerkung) VALUES ('2020-09-07 17:35:00', 141, 80, 64, 'keine');
INSERT or IGNORE INTO t_daten(datum_und_uhrzeit, systole, diastole, bemerkung) VALUES ('2020-09-29 18:00:00', 120, 80, 'gemessen durch Dr. Hecht');
