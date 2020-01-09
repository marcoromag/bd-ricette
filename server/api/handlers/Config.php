<?php 

class ListaIngredienti extends ApiHandler {
    function gestisce($uri, $method) { return $method == 'GET' && $uri == '/public/ingredienti'; }
    function esegui($uri, $method, $data) { 
        $db = DB::instance();
        $filtro=isset($_GET['filtro']) ? $_GET['filtro'] : null;
        return $db->listaIngredienti($filtro);
    }
}

class ListaTipologie extends ApiHandler {
    function gestisce($uri, $method) { return $method == 'GET' && $uri == '/public/tipologie'; }
    function esegui($uri, $method, $data) { 
        $db = DB::instance();
        $filtro=isset($_GET['filtro']) ? $_GET['filtro'] : null;
        return $db->listaTipologie($filtro);
    }
}

class CreaIngrediente extends ApiHandler {
    function gestisce($uri, $method) { return $method == 'POST' && $uri == '/private/ingredienti'; }
    function autorizza ($utente) { return loggedIn(); }
    function esegui($uri, $method, $data) { 
        $db = DB::instance();
        return $db->aggiungiIngrediente($data);
    }
}

class CreaTipologia extends ApiHandler {
    function gestisce($uri, $method) { return $method == 'POST' && $uri == '/private/tipologie'; }
    function autorizza ($utente) { return loggedIn(); }
    function esegui($uri, $method, $data) { 
        $db = DB::instance();
        return $db->aggiungiTipologia($data);
    }
}


ApiController::registraHandler(new ListaIngredienti);
ApiController::registraHandler(new CreaIngrediente);
ApiController::registraHandler(new ListaTipologie);
ApiController::registraHandler(new CreaTipologia);
