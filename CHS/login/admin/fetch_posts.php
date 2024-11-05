<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "adminconsole";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Prepare and execute the SQL query
$sql = "SELECT id, title, description, image, created_at FROM posts ORDER BY created_at DESC";
$stmt = $conn->prepare($sql);
$stmt->execute();
$result = $stmt->get_result();

// Fetch results and adjust image path
$posts = array();
while($row = $result->fetch_assoc()) {
    $row['image'] = $row['image'] ? "../../uploads/" . $row['image'] : null; // Adjust image path
    $posts[] = $row;
}

// Output the results in JSON format
echo json_encode($posts);

// Close the connection
$conn->close();
?>
