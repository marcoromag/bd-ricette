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
        'select autore.id as id_autore, username, email, nome, cognome, consenso_liberatoria, indirizzo, data_nascita, citta, cap, telefono_abitazione, telefono_cellulare
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
            'select id, nome, unita_misura
            from ingrediente
            '
            );
        } else {
            $likeFiltro = $filtro.'%';
            $stmt = $this->prepare_statement (
            'select id, nome, unita_misura
            from ingrediente
            where nome like ?
            '
            );
            $stmt->bind_param('s',$likeFiltro);
        }
        return $this->fetch_all($stmt);
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
        $unita_misura = nve($data, 'unita_misura');
        $stmt = $this->prepare_statement (
            'insert into ingrediente (nome, unita_misura)
            values (?,?)
            '
        );
        $stmt->bind_param('ss',$nome,$unita_misura);
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
        $tipologia = nve($data, 'tipologia');
        $id_tipologia = nve($tipologia, 'id');
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
            return $this->selezionaRicetta($id_ricetta);

        } catch (Exception $e) {
            $this->conn->rollback();
            throw $e;
        }
    }

    function selezionaRicetta ($id_ricetta) {
        $stmt = $this->prepare_statement(
        'select ricetta.id, ricetta.nome, tipologia, autore, tempo_cottura, calorie, numero_porzioni, difficolta, stato, modalita_preparazione, note,
        autore.nome as nome_autore, autore.cognome as cognome_autore, autore.email as autore_email,
        stato.nome as nome_stato,
        tipologia.nome as nome_tipologia
        from ricetta
        join autore on autore.id = ricetta.autore
        join tipologia on tipologia.id = ricetta.tipologia
        join stato on stato.id = ricetta.stato
        where ricetta.id=?
        ');
        $stmt->bind_param('i',$id_ricetta);
        $result = $this->fetch_single($stmt);
        if (!$result) {
            throw new Exception ("Ricetta not trovata");
        }

        $stmt =$this->prepare_statement(
        'select ingrediente.id, nome, unita_misura, quantita
        from inclusione 
        join ingrediente on ingrediente.id = inclusione.ingrediente
        where inclusione.ricetta=?
        ');
        $stmt->bind_param('i',$id_ricetta);
        $ingredienti = $this->fetch_all($stmt);

        $ricetta = new stdClass;
        $ricetta->id = $result->id;
        $ricetta->nome = $result->nome;
        $ricetta->tempo_cottura = $result->tempo_cottura;
        $ricetta->calorie = $result->calorie;
        $ricetta->numero_porzioni = $result->numero_porzioni;
        $ricetta->difficolta = $result->difficolta;
        $ricetta->modalita_preparazione = $result->modalita_preparazione;
        $ricetta->note = $result->note;
        $ricetta->tipologia = new stdClass;
        $ricetta->tipologia->id = $result->tipologia;
        $ricetta->tipologia->nome = $result->nome_tipologia;
        $ricetta->stato = new stdClass;
        $ricetta->stato->id = $result->stato;
        $ricetta->stato->nome = $result->nome_stato;
        $ricetta->autore = new stdClass;
        $ricetta->autore->id = $result->autore;
        $ricetta->autore->nome = $result->nome_autore;
        $ricetta->autore->cognome = $result->cognome_autore;
        $ricetta->autore->email = $result->autore_email;
        $ricetta->ingredienti = $ingredienti;
        return $ricetta;
    }

    function cambiaStatoRicetta ($id_ricetta, $id_stato, $utente) {
        $id_utente = (int) nve ($utente, 'id_utente');

        $this->conn->begin_transaction();
        try {

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

} 

?>