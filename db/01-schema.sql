
drop database ricette;
create database ricette;
use ricette;

create or replace table autore (
		id bigint auto_increment not null,
        email varchar(128) not null,
        nome varchar(255) not null,
        cognome varchar(255) not null,
        consenso_liberatoria boolean not null,
        indirizzo varchar(255),
        data_nascita date,
        citta varchar(255),
        cap varchar(5),
        telefono_abitazione varchar(10),
        telefono_cellulare varchar(10),
        CONSTRAINT pk_cliente PRIMARY key (id),
        CONSTRAINT uk_cliente_email UNIQUE key (email)
);

create or replace table redattore (
        matricola varchar(36) not null,
        tipo enum('R', 'C') not null CHECK (tipo in ('R', 'C')),
        nome varchar(64) not null,
        cognome varchar(64) not null,
        CONSTRAINT pk_cliente PRIMARY key (matricola)
);

create or replace table utente (
		id bigint auto_increment not null,
        username varchar(64) not null,
        password varchar(64) not null,
        autore bigint,
        redattore varchar(36),
        CONSTRAINT pk_utente PRIMARY KEY (id),
        CONSTRAINT uk_utente_username UNIQUE KEY (username),
        CONSTRAINT fk_utente_autore FOREIGN KEY (autore) REFERENCES autore(id),
        CONSTRAINT fk_utente_redattore FOREIGN KEY (redattore) REFERENCES redattore(matricola),
        CONSTRAINT ck_autore_o_redattore CHECK ((autore is null and redattore is not null) or (autore is not null and redattore is null))
);

create or replace table ingrediente (
	id int auto_increment not null,
	nome varchar(64) not null,
	unita_misura varchar(64) not null,
	CONSTRAINT pk_ingrediente PRIMARY KEY (id),
	CONSTRAINT uk_ingrediente_nome UNIQUE key (nome)
);

create or replace table tipologia (
	id int auto_increment not null,
	nome varchar(64) not null,
	CONSTRAINT pk_tipologia PRIMARY KEY (id),
	CONSTRAINT uk_nome UNIQUE KEY (nome)
);

create table stato (
	id int not null,
	nome varchar(32) not null,
	constraint pk_stato PRIMARY key (id),
	constraint uk_stato_nome UNIQUE key (nome)
);

create or replace table ricetta(
	id bigint auto_increment not null,
	nome varchar(255) not null, 
	tempo_cottura int not null, 
	note LONGTEXT, 
	calorie int, 
	numero_porzioni int, 
	difficolta int not null check (difficolta <= 5), 
	modalita_preparazione LONGTEXT, 
	tipologia int not null, 
	autore bigint not null, 
	stato int not null,
	constraint pk_ricetta primary key(id),
	constraint fk_ricetta_tipologia foreign key (tipologia) REFERENCES tipologia(id),
	constraint fk_ricetta_stato foreign key (stato) REFERENCES stato(id),
	constraint fk_ricetta__autore FOREIGN KEY (autore) REFERENCES autore(id)
);

create or replace table inclusione(
	ingrediente int not null, 
	ricetta bigint not null, 
	quantita varchar(64) null,
	constraint pk_inclusione primary key (ingrediente, ricetta),
	CONSTRAINT fk_inclusione_ingrediente foreign key (ingrediente) references ingrediente(id),
	CONSTRAINT fk_inclusione_ricetta FOREIGN key (ricetta) references ricetta(id)
);

create or replace table storico_stato_ricetta (
	ricetta bigint not null, 
	utente bigint not null,
	data_ora timestamp not null,
	stato int not NULL,
	CONSTRAINT pk_storicostato primary key (ricetta, utente, data_ora),
	CONSTRAINT fk_storicostato_ricetta FOREIGN key (ricetta) references ricetta(id),
	CONSTRAINT fk_storicostato_utente FOREIGN key (utente) references utente(id),
	CONSTRAINT fk_storicostato_stato FOREIGN key (stato) references stato(id)
);

insert into stato (id,nome) VALUES
(1,'Inserito'),
(2,'In validazione'),
(3,'Validato'),
(4,'Pubblicato'),
(5,'Rigettato')
;

create view __v_ultimo_stato_max_data as 
		select ricetta, stato, max(data_ora) data_ora
		from storico_stato_ricetta 
		group by ricetta, stato
;

create or replace view v_ultimo_stato as
	select s.ricetta, s.utente, s.data_ora, s.stato
	from storico_stato_ricetta s
	join __v_ultimo_stato_max_data k on k.ricetta = s.ricetta and k.stato = s.stato and k.data_ora = s.data_ora
;

create or replace view v_ricetta_approvata_da as
	select ricetta.id, approver.utente, approver.data_ora
	from ricetta
	join v_ultimo_stato as approver on approver.ricetta = id and approver.stato=2
	join utente on approver.utente = utente.username
	join redattore on redattore.matricola = utente.redattore
;

create or replace view v_ricetta_pubblicata_da as
	select ricetta.id, approver.utente, approver.data_ora
	from ricetta
	join v_ultimo_stato as approver on approver.ricetta = id and approver.stato=4
	join utente on approver.utente = utente.username
	join redattore on redattore.matricola = utente.redattore
;

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

insert into ingrediente (nome, unita_misura) values
('farina','gr'),
('zucchero','gr'),
('uova','qta'),
('burro','gr'),
('latte','cl'),
('acqua','cl'),
('olio','cl'),
('lievito di birra','gr'),
('nocciole','gr'),
('succo di limone','cl'),
('limoni','qta'),
('succo di arancia','cl'),
('arance','qta'),
('mele', 'qta'),
('pomodori','qta'),
('passata di pomodori','gr')
;

insert into tipologia (nome) values 
('primo'),
('secondo'),
('contorno'),
('dolce'),
('antipasto'),
('snack')
;

insert into ricetta (nome,  tipologia, autore, tempo_cottura, calorie, numero_porzioni, difficolta, stato, modalita_preparazione, note) VALUES
("Pizza",1,1, 25, 540, 8, 2, 1, 'Impastare','nota')
;


insert into inclusione (ingrediente, ricetta, quantita) values 
(1,1,500),
(2,1,10),
(6,1,300),
(7,1, 100),
(8,1, 15)
;

insert into ricetta (nome,  tipologia, autore, tempo_cottura, calorie, numero_porzioni, difficolta, stato, modalita_preparazione, note) VALUES
("Pan degli angeli",4,2, 45, 540, 8, 2, 1, 'Impastare','nota')
;
insert into inclusione (ingrediente, ricetta, quantita) values 
(1,2,300),
(2,2,300),
(3,2,6)
;

insert into ricette.storico_stato_ricetta (ricetta, utente, data_ora, stato) VALUES
(1,4,CURRENT_TIMESTAMP,1),
(1,2,CURRENT_TIMESTAMP+1,2),
(1,2,CURRENT_TIMESTAMP+2,3),
(1,3,CURRENT_TIMESTAMP+3,4)
;

insert into ricette.storico_stato_ricetta (ricetta, utente, data_ora, stato) VALUES
(2,4,CURRENT_TIMESTAMP,1),
(2,2,CURRENT_TIMESTAMP+1,2),
(2,2,CURRENT_TIMESTAMP+2,3),
(2,3,CURRENT_TIMESTAMP+3,5),
(2,1,CURRENT_TIMESTAMP+3,2),
(2,1,CURRENT_TIMESTAMP+4,3),
(2,4,CURRENT_TIMESTAMP+6,5)
;

insert into ricette.storico_stato_ricetta (ricetta, utente, data_ora, stato) VALUES
(2,4,current_timestamp,5)


