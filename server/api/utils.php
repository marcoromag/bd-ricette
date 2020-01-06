<?php

function loggedIn() {
    return (isset($_SESSION) && isset($_SESSION['UTENTE'])) ? $_SESSION['UTENTE'] : null;
}

function &autore () {
    $utente = loggedIn();
    return ($utente !== null && isset ($utente->id)) ? $utente : null; 
}

function &redattore () {
    $utente = loggedIn();
    return ($utente !== null && isset ($utente->matricola)) ? $utente : null; 
}

function &capoRedattore ($utente) {
    $utente = redattore();
    return ($utente != null && $utente->tipo === 'CAPOREDATTORE') ? $utente : null;
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