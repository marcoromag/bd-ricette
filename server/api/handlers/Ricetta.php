<?php 

class CreaRicetta extends ApiHandler {
    function gestisce($uri, $method) { return $method == 'POST' && $uri == '/ricette'; }
    function autorizza ($utente) { return autore(); }
    function esegui($uri, $method, $data) { 
        $db = DB::instance();
        return $db->creaRicetta($data, autore());
    }
}

class SelectRicetta extends ApiHandler {
    static $pathRegexp = '@^/ricette/([\d]+)$@';

    function gestisce($uri, $method) { return $method == 'GET' && preg_match(self::$pathRegexp,$uri); }
    function autorizza ($utente) { return loggedIn(); }
    function esegui($uri, $method, $data) { 
       preg_match(self::$pathRegexp,$uri, $match);

        $db = DB::instance();
        return $db->selezionaRicetta((int) $match[1]);
    }
}



class RicercaRicetta extends ApiHandler {
    static $pathRegexp = '@^/public/ricerca-ricette(/q)?$@';

    function gestisce($uri, $method) { return $method == 'POST' && preg_match(self::$pathRegexp,$uri); }
    function esegui($uri, $method, $data) { 
        preg_match(self::$pathRegexp,$uri, $match);
        $q =  isset($match[1]); 

        if (!redattore()) {
            $data->stato=4;
        };

        $db = DB::instance();
        return $db->ricercaRicetta($data, $q);
    }
}

class RicetteInLavorazione extends ApiHandler {
    static $pathRegexp = '@^/private/ricette-in-lavorazione$@';

    function gestisce($uri, $method) { return $method == 'GET' && $uri==='/private/ricette-in-lavorazione';}
    function autorizza ($utente) { return redattore(); }
    function esegui($uri, $method, $data) { 

        $db = DB::instance();
        return $db->ricetteInLavorazionePerUtente(redattore());
    }
}

class UltimeRicette extends ApiHandler {
    function gestisce($uri, $method) { return $method == 'GET' && $uri == '/public/ultime-ricette'; }
    function esegui($uri, $method, $data) { 
        $num = isset($_GET['numero']) ? (int) $_GET['numero'] : 0;
        if ($num > 25) $num = 25;
        if ($num === 0) $num = 5;
        $db = DB::instance();
        return $db->ultimeRicettePubblicate($num);
    }
}

class CambiaStatoRicetta extends ApiHandler {
    static $pathRegexp = '@^/ricette/([\d]+)/stato/([\d]+)$@';

    function gestisce($uri, $method) { return $method == 'POST' && preg_match(self::$pathRegexp,$uri); }
    function autorizza ($utente) { return redattore(); }
    function esegui($uri, $method, $data) { 
       preg_match(self::$pathRegexp,$uri, $match);

        $db = DB::instance();
        return $db->cambiaStatoRicetta((int) $match[1], (int)$match[2], redattore());
    }
}


ApiController::registraHandler(new CreaRicetta);
ApiController::registraHandler(new SelectRicetta);
ApiController::registraHandler(new CambiaStatoRicetta);
ApiController::registraHandler(new RicercaRicetta);
ApiController::registraHandler(new UltimeRicette);
ApiController::registraHandler(new RicetteinLavorazione);