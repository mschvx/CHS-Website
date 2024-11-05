document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the default form submission behavior
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    fetch('login.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`
    })
    .then(response => response.text())
    .then(data => {
        if (data === 'Login successful') {
            window.location.href = 'admin/adminconsole.html'; // Redirect to admin console
        } else {
            const errorMsg = document.getElementById('error-msg');
            if (!errorMsg) {
                const msg = document.createElement('p');
                msg.id = 'error-msg';
                msg.style.color = 'red';
                msg.innerText = data;
                document.querySelector('.login-box').appendChild(msg);
            } else {
                errorMsg.innerText = data;
            }
        }
    })
    .catch(error => console.error('Error:', error));
});
