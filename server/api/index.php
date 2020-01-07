<?php
require __DIR__."/db.php";
require __DIR__."/utils.php";
require __DIR__."/ApiController.php";
require __DIR__."/handlers/Login.php";
require __DIR__."/handlers/Config.php";
require __DIR__."/handlers/Ricetta.php";

$servername = "localhost:3306";
$username = "admin";
$password = "pass";

// Crea la connessione
DB::start($servername, $username, $password, "ricette");

$controller = new ApiController('/api');
$controller->eseguiRichiesta();
