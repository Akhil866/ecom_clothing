window.onload = () => {
    if (sessionStorage.user) {
        const user = JSON.parse(sessionStorage.user);
        if (compareToken(user.authToken, user.email)) {
            location.replace('/');
        }
    }
};

// Select loader element
const loader = document.querySelector('.loader');

// Select form elements
const submitBtn = document.querySelector('.submit-btn');
const nameInput = document.querySelector('#name'); // Sign-up only
const emailInput = document.querySelector('#email');
const passwordInput = document.querySelector('#password');
const numberInput = document.querySelector('#number'); // Sign-up only
const tacInput = document.querySelector('#terms-and-cond'); // Sign-up only
const notificationInput = document.querySelector('#notification'); // Sign-up only

// Check if submitBtn exists before adding event listener
if (submitBtn) {
    submitBtn.addEventListener('click', () => {
        loader.style.display = 'block'; // Show loader immediately

        if (nameInput) { // Sign-up page
            // Validation for signup
            if (nameInput.value.length < 3) {
                showAlert('Name must be at least 3 characters long');
                loader.style.display = 'none'; // Hide loader
            } else if (!emailInput.value.trim()) {
                showAlert('Enter your email');
                loader.style.display = 'none';
            } else if (passwordInput.value.length < 8) {
                showAlert('Password must be at least 8 characters long');
                loader.style.display = 'none';
            } else if (!numberInput.value.trim() || !/^\d+$/.test(numberInput.value) || numberInput.value.length < 10) {
                showAlert('Invalid number, please enter a valid one');
                loader.style.display = 'none';
            } else if (!tacInput.checked) {
                showAlert('You must agree to our terms and conditions');
                loader.style.display = 'none';
            } else {
                // Submit form
                sendData('/signup', {
                    name: nameInput.value,
                    email: emailInput.value,
                    password: passwordInput.value,
                    number: numberInput.value,
                    tac: tacInput.checked,
                    notification: notificationInput.checked,
                    seller: false
                });
            }
        } else { // Login route
            // Validation for login
            if (!emailInput.value.trim() || !passwordInput.value.trim()) {
                showAlert('Fill in all the inputs');
                loader.style.display = 'none';
            } else {
                // Submit form
                sendData('/login', {
                    email: emailInput.value,
                    password: passwordInput.value,
                });
            }
        }
    });
} else {
    console.error('Submit button not found');
}

// Function to show alerts
const showAlert = (message) => {
    console.log('showAlert called with message:', message); // Debugging line
    alert(message);
};

// Function to send data
const sendData = async (url, data) => {
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        const result = await response.json();
        loader.style.display = 'none'; // Hide loader after response

        if (response.ok) {
            // Handle successful response (e.g., redirect or update UI)
            if (url === '/signup') {
                alert('Signup successful!');
                location.replace('/login'); // Redirect to login page
            } else if (url === '/login') {
                sessionStorage.setItem('user', JSON.stringify(result));
                location.replace('/');
            }
        } else {
            showAlert(result.error || 'An error occurred. Please try again.');
        }
    } catch (error) {
        console.error('Error sending data:', error);
        loader.style.display = 'none'; // Hide loader on error
        showAlert('An unexpected error occurred. Please try again later.');
    }
};
