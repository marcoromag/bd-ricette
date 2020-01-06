<?php 

class LoginAutoreHandler extends ApiHandler {
    function gestisce($uri, $method) { return $method == 'POST' && $uri == '/autore/login'; }
    function esegui($uri, $method, $data) { 

        if (!$data->utente || !$data->password) {
            throw new Exception ("Nome utente e password devono essere inseriti");
        }
        $db = DB::instance();

        $utente = $db->loginAutore($data->utente, $data->password);

        if ($utente) {
            session_regenerate_id();
            $_SESSION['UTENTE'] = $utente;
            return $utente;
        } else {
            throw new Exception ("Utente o password errati");
        }

        
    }
}

class LoginRedattoreHandler extends ApiHandler {
    function gestisce($uri, $method) { return $method == 'POST' && $uri == '/redattore/login'; }
    function esegui($uri, $method, $data) { 

        if (!$data->utente || !$data->password) {
            throw new Exception ("Nome utente e password devono essere inseriti");
        }
        $db = DB::instance();

        $utente = $db->loginRedattore($data->utente, $data->password);

        if ($utente) {
            session_regenerate_id();
            $_SESSION['UTENTE'] = $utente;
            return $utente;
        } else {
            throw new Exception ("Utente o password errati");
        }
    }
}

class AutoreHandler extends ApiHandler {
    function gestisce($uri, $method) { return $method == 'GET' && $uri == '/autore'; }
    function esegui($uri,$method, $data) { 
        $autore = autore();
        if (!$autore) {
            throw new Exception ("Non loggato");
        }
        
        return  $autore;
    }
}

class CreaAutoreHandler extends ApiHandler {
    function gestisce($uri, $method) { return $method == 'POST' && $uri == '/utente'; }
    function esegui($uri,$method, $data) { 
        $db = DB::instance();
        $utente = $db->registraAutore($data);
        session_regenerate_id();
        $_SESSION['UTENTE'] = $utente;
        return $utente;
    }
}


class LogoutHandler extends ApiHandler {
    function gestisce($uri, $method) { return $method == 'POST' && $uri == '/logout'; }
    function esegui($uri, $method, $data) { 
        session_unset();
        session_regenerate_id();
        return new stdClass;
    }
}

ApiController::registraHandler(new LoginAutoreHandler);
ApiController::registraHandler(new LoginRedattoreHandler);
ApiController::registraHandler(new LogoutHandler);
ApiController::registraHandler(new AutoreHandler);
ApiController::registraHandler(new CreaAutoreHandler);