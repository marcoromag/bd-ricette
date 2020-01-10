<?php

class StatisticheCntPerRedattore extends ApiHandler {
    function gestisce($uri, $method) { return $method == 'GET' && $uri==='/statistiche/conteggio-approvazioni';}
    function autorizza ($utente) { return capoRedattore(); }
    function esegui($uri, $method, $data) { 

        $db = DB::instance();
        return $db->statisticheApprovazioniPerRedattore(autore());
    }
}

ApiController::registraHandler(new StatisticheCntPerRedattore);