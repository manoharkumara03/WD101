document.addEventListener('DOMContentLoaded', function() {
    loadEntries();
});

document.getElementById('registrationForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    const dob = document.getElementById('dob').value;
    const terms = document.getElementById('terms').checked;

    let isValid = true;
    if (!name) {
        showError(document.getElementById('name'), "Name is required.");
        isValid = false;
    } else {
        clearError(document.getElementById('name'));
    }

    if (!email) {
        showError(document.getElementById('email'), "Email is required.");
        isValid = false;
    } else if (!validateEmail(email)) {
        showError(document.getElementById('email'), "Please enter a valid email address.");
        isValid = false;
    } else {
        clearError(document.getElementById('email'));
    }

    if (!password) {
        showError(document.getElementById('password'), "Password is required.");
        isValid = false;
    } else if (!validatePassword(password)) {
        showError(document.getElementById('password'), "Password must be at least 8 characters long and include a mix of letters and numbers.");
        isValid = false;
    } else {
        clearError(document.getElementById('password'));
    }

    if (!dob) {
        showError(document.getElementById('dob'), "Date of Birth is required.");
        isValid = false;
    } else if (!validateAge(dob)) {
        showError(document.getElementById('dob'), "Age must be between 18 and 55 years.");
        isValid = false;
    } else {
        clearError(document.getElementById('dob'));
    }

    if (!terms) {
        showError(document.getElementById('terms').parentElement, "You must accept the terms and conditions.");
        isValid = false;
    } else {
        clearError(document.getElementById('terms').parentElement);
    }

    if (isValid) {
        const entry = {
            name,
            email,
            password,  
            dob: formatDate(dob),
            terms
        };
        let entries = JSON.parse(localStorage.getItem('entries')) || [];
        entries.push(entry);
        localStorage.setItem('entries', JSON.stringify(entries));
        addEntryToTable(entry);
        document.getElementById('registrationForm').reset();
    }
});

function loadEntries() {
    const entries = JSON.parse(localStorage.getItem('entries')) || [];
    entries.forEach(entry => addEntryToTable(entry));
}

function addEntryToTable(entry) {
    const table = document.getElementById('entriesTable').getElementsByTagName('tbody')[0];
    const newRow = table.insertRow();

    newRow.insertCell(0).textContent = entry.name;
    newRow.insertCell(1).textContent = entry.email;
    newRow.insertCell(2).textContent = entry.dob;
    newRow.insertCell(3).textContent = entry.terms ? 'Yes' : 'No';
}

function validateAge(dob) {
    const birthDate = new Date(dob);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const month = today.getMonth() - birthDate.getMonth();

    if (month < 0 || (month === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }

    return age >= 18 && age <= 55;
}

function showError(input, message) {
    const errorElement = document.getElementById(`${input.id}Error`) || input.nextElementSibling;
    errorElement.textContent = message;
    errorElement.style.visibility = 'visible';
    input.style.borderColor = '#e74c3c';
}

function clearError(input) {
    const errorElement = document.getElementById(`${input.id}Error`) || input.nextElementSibling;
    errorElement.textContent = '';
    errorElement.style.visibility = 'hidden';
    input.style.borderColor = '#ccc';
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
}

function validatePassword(password) {
    const re = /^(?=.*[a-zA-Z])(?=.*\d).{8,}$/;
    return re.test(password);
}

function formatDate(dateString) {
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-GB', options);
}
