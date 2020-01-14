<?php

class DBException extends RuntimeException {
    function __construct($statement, $errorMessage, $errNo) {
        $this->statement = $statement;
        $this->errorMessage = $errorMessage;
        $this->errNo = $errNo;
    }
}

class DB {

    private static $singleton = null;
    private $conn = null;
    private $statements = [];

    private $queries = [];

    public function allQueries() {
        return $this->queries;
    }

    private function __construct($servername, $username, $password) {
        $this->conn = new mysqli($servername, $username, $password);

        // Check connection
        if ($this->conn->connect_error) {
            die("Connection failed: " . $this->conn->connect_error);
        }
    }

    static function start($servername, $username, $password, $db) {
        self::$singleton = new DB($servername, $username, $password);
        self::$singleton->conn->select_db($db);
    }

    static function instance() {
        if (!self::$singleton) die ("DB not initialized");
        return self::$singleton;
    }

    private function prepare_statement ($statement) {
        $this->queries[] = $statement;
        if (!isset($this->statements[$statement])) {
            $stmt = $this->conn->prepare($statement);
            if (!$stmt)
                die("Cannot create statement [".$statement."]: ".$this->conn->error);
            $this->statements[$statement] = $stmt;
        }
        return $this->statements[$statement];
    }

    private function fetch_single ($stmt) {
        if (!$stmt->execute()) 
            return false;

        if (!($res = $stmt->get_result())) {
            return false;
        }

        if ($res->num_rows == 0)
            return false;
        
        if ($res->num_rows > 1)
            return false;

        $row = $res->fetch_assoc();


        $res->close();

        return (object) $row;
    }

    private function fetch_all($stmt) {
        if (!$stmt->execute()) {
            throw new Exception ($stmt->error);
        }

        if (!($res = $stmt->get_result())) {
            throw new Exception ($stmt->error);
        }

        $result = [];

        while ($row = $res->fetch_assoc()) {
            $result[] = (object) $row;
        } 

        $res->close();
        
        return $result;       
    }

    private function execute($stmt, $errorIfNotExecuted = null) {
        if (!$stmt->execute()) {
            throw new Exception($errorIfNotExecuted ? $errorIfNotExecuted : $stmt->error);
        } 

        if ($this->conn->insert_id) {
            return $this->conn->insert_id;
        }

        return true;
    }

    function loginAutore($username, $password) {
        $stmt = $this->prepare_statement (
        'select autore.id as id_autore, utente.id as id_utente, username, email, nome, cognome, consenso_liberatoria, indirizzo, data_nascita, citta, cap, telefono_abitazione, telefono_cellulare
        from utente
        join autore on autore.id = utente.autore
        where username=? and password=?
        '
        );
        $stmt->bind_param('ss',$username, $password);

        return $this->fetch_single($stmt);
    }

    function registraAutore($data) {

        $this->conn->begin_transaction();
        $email = nve($data,'email');
        $nome = nve($data,'nome');
        $cognome = nve($data,'cognome');
        $consenso_liberatoria = nve($data,'consenso_liberatoria');
        $indirizzo = nvl($data,'indirizzo');
        $citta = nvl($data,'citta');
        $cap = nvl($data,'cap');
        $telefono_abitazione = nvl($data,'telefono_abitazione');
        $telefono_cellulare = nvl($data,'telefono_cellulare');
        $username = nve($data,'username');
        $password = nve($data,'password');

        try {
            $stmt = $this->prepare_statement (
                'insert into autore (email, nome, cognome, consenso_liberatoria, indirizzo, citta, cap, telefono_abitazione, telefono_cellulare) 
                values 
                (?, ?, ?, ?, ?, ?, ?, ?, ?)
                ');

            $stmt->bind_param('sssssssss',
                $email,
                $nome,
                $cognome,
                $consenso_liberatoria,
                $indirizzo,
                $citta,
                $cap,
                $telefono_abitazione,
                $telefono_cellulare
            );

            $id_autore = $this->execute($stmt);
            $stmt = $this->prepare_statement (
                'insert into utente (username, password, autore) 
                values 
                (?, ?, ?)
                ');
            $stmt->bind_param('ssi',
                $username,
                $password,
                $id
            );
            $id_utente = $this->execute ($stmt);
            $this->conn->commit();

            $data->id_autore = $id_autore;
            $data->id_utente = $id_utente;
            unset($data->username);
            unset($data->password);
            return $data;
        } catch (Exception $e) {
            $this->conn->rollback();
            throw $e;
        }
    }

    function loginRedattore($username, $password) {
        $stmt = $this->prepare_statement (
        'select id as id_redattore, utente.id as id_utente, username, matricola, tipo, nome, cognome
        from utente
        join redattore on matricola = utente.redattore
        where username=? and password=?
        '
        );
        $stmt->bind_param('ss',$username, $password);
        return $this->fetch_single($stmt);
    }

    function listaIngredienti($filtro) {
        $stmt = null;
        if (null == $filtro) {
            $stmt = $this->prepare_statement (
            'select id, nome
            from ingrediente
            '
            );
        } else {
            $likeFiltro = $filtro.'%';
            $stmt = $this->prepare_statement (
            'select id, nome
            from ingrediente
            where nome like ?
            '
            );
            $stmt->bind_param('s',$likeFiltro);
        }
        return $this->fetch_all($stmt);
    }

    function aggiungiStoricoRicetta($ricetta) {
        $stmt = $this->prepare_statement('
        select stato, stato.nome as nome_stato, data_ora, utente.id as id_utente, ifnull(redattore.nome, autore.nome) nome, ifnull (redattore.cognome, autore.cognome) cognome
        from storico_stato_ricetta
        join ricette.utente on storico_stato_ricetta.utente = utente.id
        join stato on stato.id = storico_stato_ricetta.stato
        left join redattore on utente.redattore = redattore.matricola
        left join autore on utente.autore = autore.id
        where ricetta=?
        order by data_ora desc
        ');
        $stmt->bind_param('i',$ricetta->id);
        $data = $this->fetch_all($stmt);
        $ricetta->storico = $data;
        return $data;
    }

    function listaTipologie($filtro) {
        $stmt = null;
        if (null == $filtro) {
            $stmt = $this->prepare_statement (
            'select id, nome
            from tipologia
            '
            );
        } else {
            $likeFiltro = $filtro.'%';
            $stmt = $this->prepare_statement (
            'select id, nome
            from tipologia
            where nome like ?
            '
            );
            $stmt->bind_param('s',$likeFiltro);
        }
        return $this->fetch_all($stmt);
    }

    function aggiungiIngrediente ($data) {
        $nome = nve($data,'nome');
        $stmt = $this->prepare_statement (
            'insert into ingrediente (nome)
            values (?)
            '
        );
        $stmt->bind_param('s',$nome);
        $id = $this->execute($stmt);
        $data->id = $id;
        return $data;
    }

    function aggiungiTipologia ($data) {
        $nome = nve($data,'nome');
        $stmt = $this->prepare_statement (
            'insert into tipologia (nome)
            values (?)
            '
        );
        $stmt->bind_param('s',$nome);
        $id = $this->execute($stmt);
        $data->id = $id;
        return $data;
    }

    function creaRicetta ($data, $autore) {
        $nome = nve($data,'nome');
        $tempo_cottura = (int) nvl ($data,'tempo_cottura');
        $note = nvl($data, 'note');
        $calorie = (int) nve($data,'calorie');
        $numero_porzioni = (int) nve($data,'numero_porzioni');
        $difficolta = (int) nve($data, 'difficolta');
        $modalita_preparazione = nve($data, 'modalita_preparazione');
        $id_tipologia = nve($data, 'tipologia');
        $id_autore = (int) nve ($autore, 'id_autore');
        $id_utente = (int) nve ($autore, 'id_utente');
        $stato = 1;
        $ingredienti = nve($data, 'ingredienti');

        $this->conn->begin_transaction();
        try {
            //crea la ricetta
            $stmt = $this->prepare_statement(
            'insert into ricetta (nome,  tipologia, autore, tempo_cottura, calorie, numero_porzioni, difficolta, stato, modalita_preparazione, note) 
            VALUES
            (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ');
            $stmt->bind_param('siiiiiiiss',
                $nome,
                $id_tipologia,
                $id_autore,
                $tempo_cottura, 
                $calorie, 
                $numero_porzioni, 
                $difficolta, 
                $stato, 
                $modalita_preparazione, 
                $note
            );
            $id_ricetta = $this->execute($stmt);

            //aggiunge lo storico dello stato
            $stmt = $this->prepare_statement(
            'insert into storico_stato_ricetta (ricetta, utente, data_ora, stato) 
            VALUES (?, ?, current_timestamp, ?)
            ');
            $stmt->bind_param('iii',
                $id_ricetta,
                $id_utente,
                $stato
            );   
            $this->execute($stmt);    

            //link con ingredienti
            foreach ($ingredienti as $ingrediente) {
                //crea gli ingredienti mancanti
                if (!nvl($ingrediente,'id')) {
                    $newIngrediente = $this->aggiungiIngrediente($ingrediente);
                    $ingrediente->id = $newIngrediente->id;
                }
                $id_ingrediente = nve($ingrediente,'id');
                $quantita = nve($ingrediente, 'quantita');

                $stmt = $this->prepare_statement(
                    'insert into inclusione (ricetta, ingrediente, quantita) 
                    VALUES (?, ?, ?)
                    ');
                    $stmt->bind_param('iii',
                        $id_ricetta,
                        $id_ingrediente,
                        $quantita
                    );  
                    $this->execute($stmt);  
            }

            $this->conn->commit();
            return $this->selezionaRicetta($id_ricetta, false);

        } catch (Exception $e) {
            $this->conn->rollback();
            throw $e;
        }
    }

    function ricercaRicetta ($filtri, $return_query = false) {
        $bind_string = "";
        $bind_array = [];
        $query = [];
        $join = [];

        if (isset($filtri->stato)) {
            $query[] = 'stato = ?';
            $bind_array[] = (int) $filtri->stato;
            $bind_string .= 'i';
        }

        if (isset($filtri->autore)) {
            $query[] = 'autore = ?';
            $bind_array[] = (int) $filtri->autore;
            $bind_string .= 'i';
        }

        if (isset($filtri->tipologia)) {
            $query[] = 'tipologia = ?';
            $bind_array[] = (int) $filtri->tipologia;
            $bind_string .= 'i';
        }

        if (isset($filtri->tempo_cottura_min)) {
            $query[] = 'tempo_cottura  >= ?';
            $bind_array[] = (int) $filtri->tempo_cottura_min;
            $bind_string .= 'i';
        }

        if (isset($filtri->tempo_cottura_max)) {
            $query[] = 'tempo_cottura  <= ?';
            $bind_array[] = (int) $filtri->tempo_cottura_max;
            $bind_string .= 'i';
        }

        if (isset($filtri->difficolta)) {
            $query[] = 'difficolta = ?';
            $bind_array[] = (int) $filtri->difficolta;
            $bind_string .= 'i';
        }

        if (isset($filtri->ingredienti)) {
            $join[] = 'join inclusione on inclusione.ricetta = r.id';
            $tmpP = '';
            foreach ($filtri->ingredienti as $ingrediente) {
                $bind_string .= 'i';
                $bind_array[] = (int) $ingrediente;
                if ($tmpP === '') 
                    $tmpP .= '?';
                else 
                    $tmpP .= ',?';
            }
            $query[] = 'inclusione.ingrediente in ('.$tmpP.')';
        }

        if (isset($filtri->calorie_min)) {
            $query[] = 'calorie >= ?';
            $bind_array[] = (int) $filtri->calorie_min;
            $bind_string .= 'i';
        }

        if (isset($filtri->calorie_max)) {
            $query[] = 'calorie <= ?';
            $bind_array[] = (int) $filtri->calorie_max;
            $bind_string .= 'i';
        }

        $stmt = 'select distinct r.*
            from v_ricetta_full r
            '.implode(' ', $join).
            ($query ? ' where '
            .implode(' and ',$query)
            :'');
        if ($return_query) return $stmt;
       
        $stmt = $this->prepare_statement($stmt);
            

        

        array_unshift ($bind_array, $bind_string);
        call_user_func_array(array($stmt, 'bind_param'), refValues($bind_array));

        $result = $this->fetch_all($stmt);
        foreach ($result as $item) {
            $this->aggiungiIngredientiARicetta($item);
        }

        return $result;
    }

    private function aggiungiIngredientiARicetta ($ricetta) {
        $stmt =$this->prepare_statement(
            'select ingrediente.id, nome, quantita
            from inclusione 
            join ingrediente on ingrediente.id = inclusione.ingrediente
            where inclusione.ricetta=?
            ');
        $stmt->bind_param('i',$ricetta->id);
        $ingredienti = $this->fetch_all($stmt);
        $ricetta->ingredienti = $ingredienti;
        return $ricetta;
    }

    function ricetteInLavorazionePerUtente ($utente) {
        $id_utente = (int) nve($utente,'id_utente');
        $stmt = $this->prepare_statement('
        select r.*
        from utente 
        join v_ultimo_stato on utente.id = v_ultimo_stato.utente
        join v_ricetta_full r on v_ultimo_stato.stato = r.stato and v_ultimo_stato.ricetta = r.id
        where v_ultimo_stato.stato = 2
        and utente.id=?
        ');
        $stmt->bind_param('i',$id_utente);

        $result = $this->fetch_all($stmt);
        foreach ($result as $item) {
            $this->aggiungiIngredientiARicetta($item);
        }

        return $result;

    }

    function ricetteNonPubblicatePerAutore ($autore) {
        $id_autore = (int) nve($autore,'id_autore');
        $stmt = $this->prepare_statement('
        select distinct r.*
            from v_ricetta_full r
            where stato <> 4
        ');
        $result = $this->fetch_all($stmt);
        foreach ($result as $item) {
            $this->aggiungiIngredientiARicetta($item);
            $this->aggiungiStoricoRicetta($item);
        }
        return $result;
    }

    function selezionaRicetta ($id_ricetta, $pubblicata=true) {
        $andCond=$pubblicata ? "and stato=4" : "";
        $stmt = $this->prepare_statement(
        'select *
        from v_ricetta_full
        where id=?
        '.$andCond);
        $stmt->bind_param('i',$id_ricetta);
        $result = $this->fetch_single($stmt);
        if (!$result) {
            throw new Exception ("Ricetta not trovata");
        }

        return $this->aggiungiIngredientiARicetta($result);
    }



    function statoRicettePerAutore ($id_autore) {
        $stmt = $this->prepare_statement('
            select id, nome, stato 
            from ricette
            where autore = ? 
        ');
        $stmt->bind_param('i',(int) $id_autore);
        return $this->fetch_all($stmt);
    }

    function ultimeRicettePubblicate ($limit) {
        $stmt = $this->prepare_statement(
            'select r.*, s.data_ora
            from v_ricetta_full r
            join v_ultimo_stato s on s.ricetta = r.id and s.stato = r.stato
            where r.stato = 4
            order BY data_ora desc
            limit ?
            ');
            $stmt->bind_param('i',$limit);
            $result = $this->fetch_all($stmt);
            foreach ($result as $item) {
                $this->aggiungiIngredientiARicetta($item);
            }
    
            return $result;
    }

    function cambiaStatoRicetta ($id_ricetta, $id_stato, $utente) {
        $id_utente = (int) nve ($utente, 'id_utente');

        $this->conn->begin_transaction();
        try {
            $stmt = $this->prepare_statement('
            select r.stato, s.utente
            from  ricetta r
            join v_ultimo_stato s on s.ricetta = r.id and s.stato = r.stato
            where id=?
            for update
            ');
            $stmt->bind_param('i',
                $id_ricetta
            );

            $stato_corrente = (int) $this->fetch_single($stmt)->stato;
            $utente_corrente = $this->fetch_single($stmt)->utente;
            $transizione_possibile = false;
            //controlla quali transizioni sono possibili

            if ($utente->tipo === 'R') {
                if ($stato_corrente == 1) {
                    switch ($id_stato) {  
                        case 1:
                        case 2: 
                        case 3: 
                        case 5:  $transizione_possibile = true; break;
                    }
                }
                if ($stato_corrente == 2) {
                    switch ($id_stato) {
                        case 1: 
                        case 3: $transizione_possibile = $utente_corrente == $utente->id_utente;                      
                    }
                }
                if ($stato_corrente == 3) {
                    switch ($id_stato) {
                        case 1: 
                        case 2: 
                        case 5: $transizione_possibile = $utente_corrente == $utente->id_utente;                      
                    }
                }
                if ($stato_corrente == 5) {
                    switch ($id_stato) {
                        case 1: 
                        case 2: $transizione_possibile = $utente_corrente == $utente->id_utente;                      
                    }
                }
            }

            if ($utente->tipo === 'C') {
                $transizione_possibile = true;
            }

            if (!$transizione_possibile) {
                throw new Exception ("non sei abilitato a cambiare stato");
            }

            //aggiunge lo storico dello stato
            $stmt = $this->prepare_statement(
            'update ricetta set stato=?
            where id=?
            ');
            $stmt->bind_param('ii',
                $id_stato,
                $id_ricetta
            );   
            $this->execute($stmt);   

            //aggiunge lo storico dello stato
            $stmt = $this->prepare_statement(
            'insert into storico_stato_ricetta (ricetta, utente, data_ora, stato) 
            VALUES (?, ?, current_timestamp, ?)
            ');
            $stmt->bind_param('iii',
                $id_ricetta,
                $id_utente,
                $id_stato
            );   
            $this->execute($stmt); 
            $this->conn->commit();
        } catch (Exception $e) {
            $this->conn->rollback();
            throw $e;
        }  
    }

    function statisticheApprovazioniPerRedattore () {
        $stmt = $this->prepare_statement('
        select redattore.matricola, nome, cognome, ifnull(num,0) conteggio
        from redattore 
        left join (
            select matricola,  count(*) as num 
            from v_ricette_approvate_per_redattore
            group by matricola
        ) cnt on cnt.matricola = redattore.matricola
        ');
        return $this->fetch_all($stmt);
    }

    function listaRicetteApprovatePerRedattore ($matricola, $campi) {
        $campiAmmessi = array(
            'matricola',
            'nome_redattore',
            'cognome_redattore',
            'ricetta',
            'data_ora',
            'stato',
            'nome',
            'tempo_cottura',
            'note',
            'calorie',
            'numero_porzioni',
            'difficolta',
            'modalita_preparazione',
            'tipologia'
        );

        $campiSelect = array_intersect ($campi, $campiAmmessi);
        $stmt = $this->prepare_statement('
        select '.implode(', ',$campiSelect).'
        from v_ricette_approvate_per_redattore
        where matricola=?
        ');
        $stmt->bind_param('s',$matricola);
        return $this->fetch_all($stmt);
    }

} 

?>