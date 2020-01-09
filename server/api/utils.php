<?php

function loggedIn() {
    return (isset($_SESSION) && isset($_SESSION['UTENTE'])) ? $_SESSION['UTENTE'] : null;
}

function autore () {
    $utente = loggedIn();
    return ($utente !== null && isset ($utente->id_autore)) ? $utente : null; 
}

function redattore () {
    $utente = loggedIn();
    return ($utente !== null && isset ($utente->id_redattore)) ? $utente : null; 
}

function capoRedattore () {
    $utente = redattore();
    return ($utente != null && $utente->tipo === 'C') ? $utente : null;
}

function nvl (&$object, $field, &$nvl = null) {
    if ($object === null) return $nvl;
    if (is_object($object)) {
        return isset($object->$field) ? $object->$field : $nvl;
    }
    return isset($object[$field]) ? $object[$field] : $nvl;
}

function nve (&$object, $field) {
    if ($object === null) throw new Exception ($field." mancante");
    if (is_object($object)) {
        if (!isset($object->$field)) throw new Exception ($field." mancante");
        return $object->$field;
    }
    if (!isset($object[$field])) throw new Exception ($field." mancante");
    return $object[$field];
}

function refValues($arr){
    if (strnatcmp(phpversion(),'5.3') >= 0) //Reference is required for PHP 5.3+
    {
        $refs = array();
        foreach($arr as $key => $value)
            $refs[$key] = &$arr[$key];
        return $refs;
    }
    return $arr;
}