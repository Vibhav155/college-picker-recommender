// auth.js

document.addEventListener('DOMContentLoaded', () => {
    // Sign Up Logic
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value;

            if (!email || !password) {
                alert('Please fill in all fields.');
                return;
            }

            if (!isValidEmail(email)) {
                alert('Please enter a valid email address.');
                return;
            }

            if (password.length < 6) {
                alert('Password must be at least 6 characters long.');
                return;
            }

            fetch('/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password })
            })
            .then(response => response.json())
            .then(data => {
                if (data.message === 'User registered successfully') {
                    alert('Sign Up Successful!');
                    window.location.href = 'signin.html';
                } else {
                    alert(data.message || 'Error during signup');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Error during signup. Please try again.');
            });
        });
    }

    // Sign In Logic
    const signinForm = document.getElementById('signinForm');
    if (signinForm) {
        signinForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value;

            if (!email || !password) {
                alert('Please fill in all fields.');
                return;
            }

            fetch('/signin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password })
            })
            .then(response => response.json())
            .then(data => {
                if (data.message === 'Sign in successful') {
                    localStorage.setItem('isLoggedIn', 'true');
                    localStorage.setItem('userEmail', email);
                    alert('Sign In Successful!');
                    window.location.href = 'index.html';
                } else {
                    alert(data.message || 'Invalid credentials');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Error during sign in. Please try again.');
            });
        });
    }
});

// Helper function to validate email
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Check login status on page load
function checkLoginStatus() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const userEmail = localStorage.getItem('userEmail');
    
    if (isLoggedIn && userEmail) {
        // Update UI for logged-in user if needed
        const loginLink = document.querySelector('a[href="signin.html"]');
        if (loginLink) {
            loginLink.textContent = userEmail;
            loginLink.href = '#';
            loginLink.onclick = function() {
                if (confirm('Do you want to log out?')) {
                    localStorage.removeItem('isLoggedIn');
                    localStorage.removeItem('userEmail');
                    window.location.reload();
                }
            };
        }
    }
}

// Call checkLoginStatus when the page loads
document.addEventListener('DOMContentLoaded', checkLoginStatus);
