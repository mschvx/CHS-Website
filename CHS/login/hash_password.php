<?php
$password = 'test'; // Replace 'text inside' with your desired password
$hashed_password = password_hash($password, PASSWORD_DEFAULT);
echo $hashed_password;

// user, pass
// himica, test

?>

