<?php
include 'JSON.php';
header('Content-type: application/json');
$files = $_FILES['Filedata'];
$json_obj = new Moxiecode_JSON();
/* encode */
$json = $json_obj->encode($files);
echo $json;
?>