document.addEventListener('DOMContentLoaded', () => {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    const clearErrors = (form) => {
        form.querySelectorAll('.error-message').forEach(el => el.textContent = '');
    };

    const registrationForm = document.getElementById('registrationForm');
    if (registrationForm) {
        registrationForm.addEventListener('submit', function(event) {
            event.preventDefault(); 
            clearErrors(this);
            let isValid = true;
            
            const fullName = document.getElementById('fullName');
            if (fullName.value.trim() === '') {
                document.getElementById('fullName-error').textContent = 'Full name is required.';
                isValid = false;
            }

            const email = document.getElementById('email');
            if (!email.value || email.value.trim() === '') {
                document.getElementById('email-error').textContent = 'Email is required.';
                isValid = false;
            } else if (!emailPattern.test(email.value)) {
                document.getElementById('email-error').textContent = 'Please enter a valid email format.';
                isValid = false;
            }

            const password = document.getElementById('password');
            if (password.value.length < 8) {
                document.getElementById('password-error').textContent = 'Password must be at least 8 characters.';
                isValid = false;
            }

            const confirmPassword = document.getElementById('confirmPassword');
            if (confirmPassword.value !== password.value) {
                document.getElementById('confirmPassword-error').textContent = 'Passwords do not match.';
                isValid = false;
            }
            
            const terms = document.getElementById('terms');
            if (!terms.checked) {
                document.getElementById('terms-error').textContent = 'You must agree to the terms.';
                isValid = false;
            }

            if (isValid) {
                console.log('Registration data valid:', new FormData(this));
                this.innerHTML = '<h2>Thank you for registering!</h2><p>Your account is created.</p>';
            }
        });
    }

    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(event) {
            event.preventDefault(); 
            clearErrors(this);
            let isValid = true;

            const email = document.getElementById('loginEmail');
            if (!email.value || !emailPattern.test(email.value)) {
                document.getElementById('loginEmail-error').textContent = 'Valid email is required.';
                isValid = false;
            }

            const password = document.getElementById('loginPassword');
            if (password.value.length === 0) {
                document.getElementById('loginPassword-error').textContent = 'Password is required.';
                isValid = false;
            }

            if (isValid) {
                console.log('Login data valid:', new FormData(this));
                this.innerHTML = '<h2>Login Successful!</h2><p>Redirecting to dashboard...</p>';
            }
        });
    }

    const searchForm = document.getElementById('searchForm');
    if (searchForm) {
        searchForm.addEventListener('submit', function(event) {
            event.preventDefault(); 
            clearErrors(this);
            let isValid = true;
            
            const query = document.getElementById('searchQuery');
            if (query.value.trim().length < 2) {
                document.getElementById('searchQuery-error').textContent = 'Please enter at least 2 characters to search.';
                isValid = false;
            }

            if (isValid) {
                const category = document.getElementById('categoryFilter').value;
                const message = `Searching for: "${query.value}" in category: ${category}.`;
                console.log(message, new FormData(this));
                searchForm.parentElement.innerHTML = `<h2>Search Results:</h2><p>${message}</p>`;
            }
        });
    }

    const checkoutForm = document.getElementById('checkoutForm');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', function(event) {
            event.preventDefault(); 
            clearErrors(this);
            let isValid = true;

            const inputs = ['shippingEmail', 'phoneNumber', 'shippingName', 'streetAddress', 'city', 'zipCode', 'shippingCountry'];
            
            inputs.forEach(id => {
                const input = document.getElementById(id);
                if (input && input.hasAttribute('required') && input.value.trim() === '') {
                     document.getElementById(id + '-error').textContent = 'This field is required.';
                     isValid = false;
                }
            });
            
            const email = document.getElementById('shippingEmail');
            if (email && email.value.trim() !== '' && !emailPattern.test(email.value)) {
                document.getElementById('shippingEmail-error').textContent = 'Please enter a valid email format.';
                isValid = false;
            }

            const phone = document.getElementById('phoneNumber');
            if (phone && phone.value.length < 10) {
                document.getElementById('phoneNumber-error').textContent = 'Phone number must be at least 10 digits.';
                isValid = false;
            }

            if (isValid) {
                console.log('Checkout data valid:', new FormData(this));
                this.innerHTML = '<h2>Shipping Confirmed!</h2><p>Proceeding to payment gateway...</p>';
            }
        });
    }
});