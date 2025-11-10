/* ==================== GLOBAL DATA ==================== */
const products = [
    { name: "Cement 50kg", price: 250.00, stock: 150 },
    { name: "Steel Bar 10mm", price: 150.00, stock: 1 },
    { name: "Wire 1.4MMG", price: 100.00, stock: 12 },
    { name: "PVC Pipe 1/2\"", price: 50.00, stock: 200 },
    { name: "Circuit Breaker 20A", price: 300.00, stock: 50 }
];
let cart = [];

/* ==================== LOGIN / LOGOUT ==================== */
document.getElementById('loginForm').addEventListener('submit', e=>{
    e.preventDefault();
    const u=document.getElementById('username').value.trim();
    const p=document.getElementById('password').value;
    if(u&&p){
        document.getElementById('loginScreen').style.display='none';
        document.getElementById('dashboardScreen').style.display='block';
        showToast('Login Successful', 'Welcome back, Admin!', 'success');
        if(pages.billing.style.display==='block') populateProducts();
    }else {
        showToast('Login Failed', 'Please enter a username and password.', 'error');
    }
});
document.getElementById('logoutBtn').addEventListener('click',e=>{
    e.preventDefault();
    document.getElementById('dashboardScreen').style.display='none';
    document.getElementById('loginScreen').style.display='block';
    document.getElementById('loginForm').reset();
});

/* ==================== SIDEBAR NAV ==================== */
const menuItems=document.querySelectorAll('.sidebar li');
const pageTitleEl = document.getElementById('pageTitle');
const pageTitles = {
    dashboard: "Dashboard Overview",
    billing: "Billing and Sales",
    account: "Account Management"
};
const pages={
    dashboard:document.getElementById('dashboardPage'),
    billing:document.getElementById('billingPage'),
    account:document.getElementById('accountPage')
};
menuItems.forEach(it=>{
    it.addEventListener('click',()=>{
        if(it.classList.contains('disabled')) return;
        menuItems.forEach(i=>i.classList.remove('active'));
        Object.values(pages).forEach(p=>p.style.display='none');
        const tgt=it.dataset.page;
        if(tgt&&pages[tgt]){
            it.classList.add('active');
            pages[tgt].style.display='block';
            pageTitleEl.textContent = pageTitles[tgt] || "Dashboard"; // Update top bar title
            if(tgt==='billing') populateProducts();
        }else{
            document.querySelector('.sidebar li[data-page="dashboard"]').classList.add('active');
            pages.dashboard.style.display='block';
            pageTitleEl.textContent = "Dashboard Overview";
        }
    });
});

/* ==================== ACCOUNT MANAGEMENT ==================== */
let currentUser=null;

// Open Registration modal
document.getElementById('addAccountBtn').addEventListener('click',()=>{
    currentUser=null;
    document.getElementById('registrationForm').reset();
    clearModalErrors('registrationForm');
    resetRegistrationForm(); // Reset to step 1
    document.getElementById('registrationModal').style.display='flex';
});


// Open Profile modal for a user
function openProfileModal(username){
    currentUser=username;
    resetProfileForm();
    document.getElementById('profileUser').textContent=username;
    // You would typically fetch user data here and populate the form
    // For demo, we just show the modal.
    document.getElementById('profileModal').style.display='flex';
}

/* ==================== MODAL HELPERS ==================== */
function closeModal(id){ document.getElementById(id).style.display='none'; }
function clearModalErrors(formId){
    const form = document.getElementById(formId);
    if (form) {
        form.querySelectorAll('.error-message').forEach(e=>e.textContent='');
        form.querySelectorAll('.invalid, .valid').forEach(el => {
            el.classList.remove('invalid', 'valid');
        });
    }
}
window.addEventListener('click',e=>{ if(e.target.classList.contains('modal')) e.target.style.display='none'; });

/* ==================== TOAST NOTIFICATION ==================== */
function showToast(title, message, type = 'info') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    const icons = {
        success: 'fa-check-circle',
        error: 'fa-times-circle',
        info: 'fa-info-circle'
    };

    toast.innerHTML = `
        <i class="fas ${icons[type]} toast-icon"></i>
        <div class="toast-content">
            <div class="title">${title}</div>
            <div class="message">${message}</div>
        </div>
        <div class="progress-bar"></div>
    `;

    container.appendChild(toast);

    // Trigger the slide-in animation
    setTimeout(() => {
        toast.classList.add('show');
    }, 100);

    // Remove the toast after 5 seconds
    setTimeout(() => {
        toast.classList.remove('show');
        // Remove from DOM after animation
        toast.addEventListener('transitionend', () => toast.remove());
    }, 5000);
}
/* ==================== VALIDATION ==================== */
const emailPattern=/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

function validateField(input, condition, errorMessage) {
    const errorElement = document.getElementById(`${input.id}-error`);
    if (condition) {
        input.classList.remove('invalid');
        input.classList.add('valid');
        if (errorElement) errorElement.textContent = '';
        return true;
    } else {
        input.classList.remove('valid');
        input.classList.add('invalid');
        if (errorElement) errorElement.textContent = errorMessage;
        return false;
    }
}

function validateForm(formId) {
    const form = document.getElementById(formId);
    const inputs = form.querySelectorAll('[required], [minlength], [maxlength]');
    let isFormValid = true;

    inputs.forEach(input => {
        const isValid = !input.checkValidity ? true : input.checkValidity();
        if (!isValid) {
            isFormValid = false;
        }
    });
    return isFormValid;
}

/* ---- Registration Wizard ---- */
let currentRegStep = 1;
const regNextBtn = document.getElementById('reg-next-btn');
const regBackBtn = document.getElementById('reg-back-btn');
const regSubmitBtn = document.getElementById('reg-submit-btn');

function updateRegStep(step) {
    currentRegStep = step;
    const modal = document.getElementById('registrationModal');
    modal.querySelectorAll('.form-step').forEach(s => s.classList.remove('active'));
    modal.querySelector(`.form-step[data-step="${step}"]`).classList.add('active');

    modal.querySelectorAll('.progress-step').forEach(s => s.classList.remove('active'));
    modal.querySelector(`.progress-step[data-step="${step}"]`).classList.add('active');

    regBackBtn.style.display = step > 1 ? 'block' : 'none';
    regNextBtn.style.display = step < 2 ? 'block' : 'none';
    regSubmitBtn.style.display = step === 2 ? 'block' : 'none';
}

regNextBtn.addEventListener('click', () => {
    let isStepValid = true;
    if (currentRegStep === 1) {
        const form = document.getElementById('registrationForm');
        const name = form.querySelector('#fullName');
        isStepValid &= validateField(name, name.value.trim().length >= 2, 'Full name required (min 2 chars).');

        const email = form.querySelector('#email');
        isStepValid &= validateField(email, emailPattern.test(email.value), 'Valid email required.');

        const password = form.querySelector('#regPassword');
        isStepValid &= validateField(password, password.value.length >= 8, 'Password must be at least 8 characters.');

        const confirmPassword = form.querySelector('#confirmPassword');
        isStepValid &= validateField(confirmPassword, confirmPassword.value === password.value && password.value.length > 0, 'Passwords do not match.');
    }
    
    if (isStepValid && currentRegStep < 2) {
        updateRegStep(currentRegStep + 1);
    }
});

regBackBtn.addEventListener('click', () => {
    if (currentRegStep > 1) updateRegStep(currentRegStep - 1);
});

function resetRegistrationForm() {
    updateRegStep(1);
    clearModalErrors('registrationForm');
    document.getElementById('registrationForm').reset();
    document.getElementById('secAnswerGroup').style.display = 'none';
}

// Password Toggle
document.querySelectorAll('.toggle-password').forEach(toggle => {
    toggle.addEventListener('click', () => {
        const passwordInput = toggle.previousElementSibling;
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            toggle.classList.remove('fa-eye-slash');
            toggle.classList.add('fa-eye');
        } else {
            passwordInput.type = 'password';
            toggle.classList.remove('fa-eye');
            toggle.classList.add('fa-eye-slash');
        }
    });
});

// Security Question Toggle
document.getElementById('secQuestion').addEventListener('change', (e) => {
    const answerGroup = document.getElementById('secAnswerGroup');
    if (e.target.value) {
        answerGroup.style.display = 'block';
    } else {
        answerGroup.style.display = 'none';
    }
});

/* ---- Profile Update Wizard ---- */
let currentProfileStep = 1;
const profileNextBtn = document.getElementById('profile-next-btn');
const profileBackBtn = document.getElementById('profile-back-btn');
const profileSubmitBtn = document.getElementById('profile-submit-btn');

function updateProfileStep(step) {
    currentProfileStep = step;
    const modal = document.getElementById('profileModal');
    modal.querySelectorAll('.form-step').forEach(s => s.classList.remove('active'));
    modal.querySelector(`.form-step[data-step="${step}"]`).classList.add('active');

    modal.querySelectorAll('.progress-step').forEach(s => s.classList.remove('active'));
    modal.querySelector(`.progress-step[data-step="${step}"]`).classList.add('active');

    profileBackBtn.style.display = step > 1 ? 'block' : 'none';
    profileNextBtn.style.display = step < 2 ? 'block' : 'none';
    profileSubmitBtn.style.display = step === 2 ? 'block' : 'none';
}

profileNextBtn.addEventListener('click', () => {
    let isStepValid = true;
    if (currentProfileStep === 1) {
         const form = document.getElementById('profileForm');
         const name = form.querySelector('#profileName');
         isStepValid &= validateField(name, name.value.trim().length >= 2, 'Full name is required.');

         const email = form.querySelector('#newEmail');
         if (email.value.trim()) {
            isStepValid &= validateField(email, emailPattern.test(email.value), 'Please enter a valid email format.');
         }
    }

    if (isStepValid && currentProfileStep < 2) updateProfileStep(currentProfileStep + 1);
});

profileBackBtn.addEventListener('click', () => {
    if (currentProfileStep > 1) updateProfileStep(currentProfileStep - 1);
});

function resetProfileForm() {
    updateProfileStep(1);
    const form = document.getElementById('profileForm');
    clearModalErrors('profileForm');
    form.reset();
}

/* ---- Registration ---- */
document.getElementById('registrationForm').addEventListener('submit',e=>{
    e.preventDefault();
    
    let isFormValid = true;
    const form = e.target;

    // Re-validate all fields on submit
    const name = form.querySelector('#fullName');
    isFormValid &= validateField(name, name.value.trim().length >= 2, 'Full name required (min 2 chars).');

    const email = form.querySelector('#email');
    isFormValid &= validateField(email, emailPattern.test(email.value), 'Valid email required.');

    const password = form.querySelector('#regPassword');
    isFormValid &= validateField(password, password.value.length >= 8, 'Password must be at least 8 characters.');

    const confirmPassword = form.querySelector('#confirmPassword');
    isFormValid &= validateField(confirmPassword, confirmPassword.value === password.value, 'Passwords do not match.');

    const birthDate = form.querySelector('#birthDate');
    isFormValid &= validateField(birthDate, birthDate.value !== '', 'Date of birth is required.');

    const secQuestion = form.querySelector('#secQuestion');
    isFormValid &= validateField(secQuestion, secQuestion.value !== '', 'Please select a security question.');

    const secAnswer = form.querySelector('#secAnswer');
    isFormValid &= validateField(secAnswer, secAnswer.value.trim() !== '', 'Security answer is required.');

    const accountRole = form.querySelector('#accountRole');
    isFormValid &= validateField(accountRole, accountRole.value !== '', 'Please select an account role.');

    if(isFormValid){
        const tbody=document.getElementById('userTableBody');
        const role = accountRole.options[accountRole.selectedIndex].text;
        const newRow=tbody.insertRow();
        newRow.innerHTML=`<td>${email.value}</td><td>${role}</td>
            <td><span class="status-badge status-active">Active</span></td>
            <td><button class="manage-btn" onclick="openProfileModal('${email.value}')">Manage</button></td>`;
        closeModal('registrationModal');
        showToast('Account Created', 'New user account has been successfully registered.', 'success');
    } else {
         showToast('Registration Failed', 'Please correct the errors in the form.', 'error');
    }
});

/* ---- Profile Update ---- */
document.getElementById('profileForm').addEventListener('submit',e=>{
    e.preventDefault();
    let isFormValid = true;
    const form = e.target;

    const name = form.querySelector('#profileName');
    isFormValid &= validateField(name, name.value.trim().length >= 2, 'Full name is required.');

    const email = form.querySelector('#newEmail');
    if (email.value.trim()) {
        isFormValid &= validateField(email, emailPattern.test(email.value), 'Please enter a valid email format.');
    }

    const password = form.querySelector('#profilePassword');
    const confirmPassword = form.querySelector('#confirmProfilePassword');
    if (password.value) {
        isFormValid &= validateField(password, password.value.length >= 8, 'Password must be at least 8 characters.');
        isFormValid &= validateField(confirmPassword, confirmPassword.value === password.value, 'Passwords do not match.');
    } else if (confirmPassword.value) {
         isFormValid &= validateField(confirmPassword, false, 'Please enter a new password first.');
    }

    const bio = form.querySelector('#profileBio');
    isFormValid &= validateField(bio, bio.value.length <= 250, 'Bio cannot exceed 250 characters.');

    if(isFormValid){
        const tbody=document.getElementById('userTableBody');
        const row=Array.from(tbody.rows).find(r=>r.cells[0].textContent===currentUser);
        if(row){
            const newEmailValue = email.value.trim();
            row.cells[0].textContent = newEmailValue || currentUser; 
            row.cells[3].innerHTML = `<button class="manage-btn" onclick="openProfileModal('${newEmailValue || currentUser}')">Manage</button>`;
            if(newEmailValue) {
                currentUser = newEmailValue;
            }
        }
        closeModal('profileModal');
        showToast('Profile Updated', 'Your changes have been saved.', 'success');
    } else {
        showToast('Update Failed', 'Please correct the errors in the form.', 'error');
    }
});

/* ==================== BILLING FUNCTIONALITY ==================== */
function populateProducts() {
    const container = document.getElementById('productItems');
    container.innerHTML = products.map(product => `
        <div class="product-item">
            <div>
                <div class="product-name">${product.name}</div>
                <div class="product-price">₱${product.price.toFixed(2)}</div>
                <div class="product-stock">Stock: ${product.stock}</div>
            </div>
            <button class="add-to-cart-btn" onclick="addToCart('${product.name}', ${product.price})">
                ADD
            </button>
        </div>
    `).join('');
}

function populateCart() {
    const container = document.getElementById('cartItems');
    if (cart.length === 0) {
        container.innerHTML = '<p style="text-align:center; color:#6c757d;padding: 20px 0;">Cart is empty</p>';
    } else {
        container.innerHTML = cart.map((item, index) => `
            <div class="cart-item">
                <div class="cart-item-details">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-info">₱${item.price.toFixed(2)} × ${item.qty}</div>
                </div>
                <div class="cart-item-subtotal">₱${item.subtotal.toFixed(2)}</div>
                <button class="remove-btn" onclick="removeFromCart(${index})">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </div>
        `).join('');
    }
    updateTotals();
}

function addToCart(name, price) {
    const existing = cart.find(item => item.name === name);
    if (existing) {
        existing.qty++;
        existing.subtotal = existing.qty * price;
    } else {
        cart.push({ name, price, qty: 1, subtotal: price });
    }
    populateCart();
    showToast('Item Added', `${name} was added to your cart.`, 'success');
}

function removeFromCart(index) {
    cart.splice(index, 1);
    populateCart();
    showToast('Item Removed', 'The item has been removed from your cart.', 'info');
}

function updateTotals() {
    const subtotal = cart.reduce((sum, item) => sum + item.subtotal, 0);
    const tax = subtotal * 0.06;
    const total = subtotal + tax;
    document.getElementById('subtotal').textContent = `₱${subtotal.toFixed(2)}`;
    document.getElementById('discount').textContent = `₱0.00`;
    document.getElementById('tax').textContent = `₱${tax.toFixed(2)}`;
    document.getElementById('total').textContent = `₱${total.toFixed(2)}`;
}

document.getElementById('clearCart').addEventListener('click', () => {
    cart = [];
    populateCart();
});

document.getElementById('processPayment').addEventListener('click', () => {
    if (cart.length === 0) {
        showToast('Payment Failed', 'Your cart is empty. Add items to proceed.', 'error');
        return;
    }
    showToast('Payment Successful', `Order confirmed for ${document.getElementById('total').textContent}.`, 'success');
    cart = [];
    populateCart();
});

// Search functionality
document.getElementById('productSearch').addEventListener('input', function(e) {
    const query = e.target.value.toLowerCase();
    const filtered = products.filter(p => p.name.toLowerCase().includes(query));
    const container = document.getElementById('productItems');
    // Need to use the new product item structure
    container.innerHTML = filtered.map(product => `
        <div class="product-item">
            <div>
                <div class="product-name">${product.name}</div>
                <div class="product-price">₱${product.price.toFixed(2)}</div>
                <div class="product-stock">Stock: ${product.stock}</div>
            </div>
            <button class="add-to-cart-btn" onclick="addToCart('${product.name}', ${product.price})">
                ADD
            </button>
        </div>
    `).join('');
});

/* ==================== OTHER BUTTONS ==================== */
document.getElementById('editAccountBtn').addEventListener('click',()=>{ showToast('Action Required', 'Select a user from the table and click “Manage” to use this feature.', 'info'); });
document.getElementById('resetPasswordBtn').addEventListener('click',()=>{ showToast('Action Required', 'Select a user from the table and click “Manage” to use this feature.', 'info'); });
document.getElementById('deactivateBtn').addEventListener('click',()=>{ showToast('Action Required', 'Select a user from the table and click “Manage” to use this feature.', 'info'); });

// Initialize cart on load
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('billingPage').style.display === 'block') {
        populateProducts();
    }
    populateCart(); 
});
