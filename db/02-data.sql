use ricette;

insert into redattore (matricola, tipo, nome, cognome) VALUES
('M01','R','Marco', 'Romagnuolo'),
('M02','R','Mario', 'Rossi'),
('M03','C','Luigi', 'bianchi')
;

insert into autore (email, nome, cognome, consenso_liberatoria) values 
('mr@gmail.com','Marco', 'Romagnuolo', true),
('l@gmail.,com','Luigi', 'Pini', true)
;

insert into utente (username,password, autore, redattore) values 
('redattore1','password',null,'M01'),
('redattore2','password',null,'M02'),
('capo','password',null,'M03'),
('mr', 'password', 1, null),
('lp', 'password', 2, null)
;

insert into ingrediente (nome) values
('farina'),
('zucchero'),
('uova'),
('burro'),
('latte'),
('acqua'),
('olio'),
('lievito di birra'),
('nocciole'),
('succo di limone'),
('limoni'),
('succo di arancia'),
('arance'),
('mele'),
('pomodori'),
('passata di pomodori')
;

insert into tipologia (nome) values 
('primo'),
('secondo'),
('contorno'),
('dolce'),
('antipasto'),
('snack')
;

