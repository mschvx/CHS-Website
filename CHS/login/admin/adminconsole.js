function logout() {
    window.location.href = "../login.html";
}

// Function to fetch posts from the server and update the DOM
function fetchPosts() {
    fetch('fetch_posts.php')
        .then(response => response.json())
        .then(data => {
            const postsContainer = document.getElementById('postsContainer');
            postsContainer.innerHTML = '';
            data.forEach(post => {
                const postItem = document.createElement('li');
                postItem.classList.add('post-item');

                const postTitle = document.createElement('span');
                postTitle.classList.add('post-title');
                postTitle.textContent = post.title;
                postTitle.addEventListener('click', function() {
                    openModal(post);
                });

                const postDate = document.createElement('span');
                postDate.classList.add('post-date');
                postDate.textContent = post.created_at;

                const deleteButton = document.createElement('button');
                deleteButton.classList.add('delete-button');
                deleteButton.textContent = 'Delete';
                deleteButton.setAttribute('data-id', post.id);
                deleteButton.addEventListener('click', function() {
                    deletePost(post.id);
                });

                const postDateDelete = document.createElement('div');
                postDateDelete.classList.add('post-date-delete');
                postDateDelete.appendChild(postDate);
                postDateDelete.appendChild(deleteButton);

                postItem.appendChild(postTitle);
                postItem.appendChild(postDateDelete);
                postsContainer.appendChild(postItem);
            });
        })
        .catch(error => {
            console.error('There has been a problem with your fetch operation:', error);
        });
}

// Function to delete a post
function deletePost(postId) {
    fetch('delete_post.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: postId }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            fetchPosts();
        } else {
            console.error('Error deleting post:', data.message);
        }
    })
    .catch(error => {
        console.error('There has been a problem with your fetch operation:', error);
    });
}

function openModal(post) {
    const modal = document.getElementById('postModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalImage = document.getElementById('modalImage');
    const modalDescription = document.getElementById('modalDescription');

    modalTitle.textContent = post.title;
    modalDescription.innerHTML = post.description; // Use innerHTML to render <br> tags

    if (post.image) {
        modalImage.src = post.image;
        modalImage.style.display = 'block';
    } else {
        modalImage.style.display = 'none';
    }

    modal.style.display = 'block';
}


// Close the modal when the user clicks the close button
document.querySelector('.close-button').addEventListener('click', function() {
    document.getElementById('postModal').style.display = 'none';
});

// Switch between Create Post and Manage Posts views
document.querySelector('.navbar-nav').addEventListener('click', function(event) {
    if (event.target.classList.contains('nav-link')) {
        document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
        event.target.classList.add('active');

        const createPostContainer = document.querySelector('.create-post');
        const managePostsContainer = document.querySelector('.manage-posts');

        if (event.target.textContent === 'Create Post') {
            createPostContainer.style.display = 'block';
            managePostsContainer.style.display = 'none';
        } else {
            createPostContainer.style.display = 'none';
            managePostsContainer.style.display = 'block';
            fetchPosts();
        }
    }
});

// Handle form submission via AJAX
document.getElementById('postForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const formData = new FormData(this);

    fetch('submit_post.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.text())
    .then(data => {
        if (data.includes('New record created successfully')) {
            // Reset the form
            document.getElementById('postForm').reset();
            // Optionally, you can show a success message to the user here
            alert('Post created successfully!');
        } else {
            console.error('Error creating post:', data);
            // Optionally, show an error message to the user
            alert('Error creating post.');
        }
    })
    .catch(error => {
        console.error('There has been a problem with your fetch operation:', error);
        // Optionally, show an error message to the user
        alert('Error creating post.');
    });
});

// Initial fetch of posts when the page loads
fetchPosts();
