// auth.js

// Sign Up Logic
if (document.getElementById('signupForm')) {
    document.getElementById('signupForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        if (email && password) {
            localStorage.setItem('user', JSON.stringify({ email, password }));
            alert('Sign Up Successful!');
            window.location.href = 'signin.html';
        } else {
            alert('Please fill all fields.');
        }
    });
}

// Sign In Logic
if (document.getElementById('signinForm')) {
    document.getElementById('signinForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        const storedUser = JSON.parse(localStorage.getItem('user'));

        if (storedUser && storedUser.email === email && storedUser.password === password) {
            localStorage.setItem('isLoggedIn', true);
            alert('Sign In Successful!');
            window.location.href = 'index.html';
        } else {
            alert('Invalid credentials. Please try again.');
        }
    });
}
