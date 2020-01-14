<?php

class StatisticheCntPerRedattore extends ApiHandler {
    function gestisce($uri, $method) { return $method == 'GET' && $uri==='/statistiche/conteggio-approvazioni';}
    function autorizza ($utente) { return capoRedattore(); }
    function esegui($uri, $method, $data) { 

        $db = DB::instance();
        return $db->statisticheApprovazioniPerRedattore(autore());
    }
}

class ListaApprovazioniPerRedattore extends ApiHandler {
    static $pathRegexp = '@^/statistiche/approvazioni/([^\/]+)$@';

    function gestisce($uri, $method) { return $method == 'GET' && preg_match(self::$pathRegexp,$uri); }
    function autorizza ($utente) { return capoRedattore(); }
    function esegui($uri, $method, $data) { 
        preg_match(self::$pathRegexp,$uri,$match);
        $db = DB::instance();
        return $db->listaRicetteApprovatePerRedattore($match[1], array_keys($_GET));
    }
}

ApiController::registraHandler(new StatisticheCntPerRedattore);
ApiController::registraHandler(new ListaApprovazioniPerRedattore);