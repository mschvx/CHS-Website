<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "adminconsole";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$data = json_decode(file_get_contents('php://input'), true);
$postId = $data['id'];

$sql = "DELETE FROM posts WHERE id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $postId);

$response = array();
if ($stmt->execute()) {
    $response['success'] = true;
} else {
    $response['success'] = false;
    $response['message'] = "Error: " . $stmt->error;
}

$stmt->close();
$conn->close();

echo json_encode($response);
?>
