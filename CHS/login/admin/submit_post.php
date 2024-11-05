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

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $title = $_POST['title'];
    $description = $_POST['description'];
    $image = null;

    // Handle file upload
    if (isset($_FILES['image']) && $_FILES['image']['error'] == 0) {
        $target_dir = "../../uploads/";
        $target_file = $target_dir . basename($_FILES["image"]["name"]);
        $imageFileType = strtolower(pathinfo($target_file, PATHINFO_EXTENSION));

        // Check if image file is a actual image or fake image
        $check = getimagesize($_FILES["image"]["tmp_name"]);
        if ($check !== false) {
            if (move_uploaded_file($_FILES["image"]["tmp_name"], $target_file)) {
                $image = basename($_FILES["image"]["name"]); // Save just the filename
            } else {
                echo "Sorry, there was an error uploading your file.";
                exit();
            }
        } else {
            echo "File is not an image.";
            exit();
        }
    }

    // Insert post data into database
    $stmt = $conn->prepare("INSERT INTO posts (title, description, image, created_at) VALUES (?, ?, ?, NOW())");
    $stmt->bind_param("sss", $title, $description, $image);

    if ($stmt->execute()) {
        echo "New record created successfully";
    } else {
        echo "Error: " . $stmt->error;
    }

    $stmt->close();
}

$conn->close();
?>
