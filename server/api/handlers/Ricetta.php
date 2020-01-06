<?php 

class CreaRicetta extends ApiHandler {
    function gestisce($uri, $method) { return $method == 'POST' && $uri == '/ricette'; }
    function autorizza ($utente) { return loggedIn(); }
    function esegui($uri, $method, $data) { 
        $db = DB::instance();
        return $db->creaRicetta($data, loggedIn());
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