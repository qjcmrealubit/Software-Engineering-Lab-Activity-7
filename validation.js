document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('registrationForm');
    
    // Simple email regex for format validation
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    form.addEventListener('submit', function(event) {
        let isValid = true;
        
        // 1. Prevent default submission to run custom validation
        event.preventDefault(); 

        // Clear all previous errors
        document.querySelectorAll('.error-message').forEach(el => el.textContent = '');

        // --- Required Fields & Format Validation ---

        // Full Name (Required, Min length check)
        const fullName = document.getElementById('fullName');
        if (fullName.value.trim() === '') {
            document.getElementById('fullName-error').textContent = 'Full name is required.';
            isValid = false;
        }

        // Email (Required, Format validation)
        const email = document.getElementById('email');
        if (!email.value || email.value.trim() === '') {
             document.getElementById('email-error').textContent = 'Email is required.';
             isValid = false;
        } else if (!emailPattern.test(email.value)) {
             document.getElementById('email-error').textContent = 'Please enter a valid email format.';
             isValid = false;
        }

        // Password (Required, Min length check)
        const password = document.getElementById('password');
        if (password.value.length < 8) {
             document.getElementById('password-error').textContent = 'Password must be at least 8 characters.';
             isValid = false;
        }

        // Confirm Password (Required, Match check)
        const confirmPassword = document.getElementById('confirmPassword');
        if (confirmPassword.value !== password.value) {
            document.getElementById('confirmPassword-error').textContent = 'Passwords do not match.';
            isValid = false;
        }
        
        // Checkbox (Required)
        const terms = document.getElementById('terms');
        if (!terms.checked) {
            document.getElementById('terms-error').textContent = 'You must agree to the terms.';
            isValid = false;
        }

        // --- Final Submission ---
        if (isValid) {
            // Functionality: Data is processed here (e.g., sent via fetch/AJAX to the backend)
            // For the demo, we'll log data and simulate success.
            console.log('Form is valid. Submitting data:', new FormData(form));
            alert('Registration Successful! (Data sent to backend for storage)');
            
            // In a real application, you would use: 
            // form.submit(); OR fetch(form.action, { method: form.method, body: new FormData(form) });
            
            // To fulfill the "reflect results in UI" requirement:
            form.innerHTML = '<h2>Thank you for registering!</h2><p>You will receive a confirmation email shortly.</p>';
        }
    });
});