document.getElementById("registrationForm").addEventListener("submit", function (event) {
    event.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const dob = document.getElementById("dob").value;
    const termsAccepted = document.getElementById("terms").checked;

    if (!isValidEmail(email)) {
        alert("Please enter a valid email address.");
        return;
    }

    if (!isValidAge(dob)) {
        alert("Age must be between 18 and 55 years.");
        return;
    }

    const entry = {
        name: name,
        email: email,
        password: password,
        dob: dob,
        termsAccepted: termsAccepted ? "true" : "false"
    };

    saveEntry(entry);
    addEntryToTable(entry);
    this.reset(); // Reset the form after submission
});

function isValidEmail(email) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
}

function isValidAge(dob) {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();

    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }

    return age >= 18 && age <= 55;
}

function saveEntry(entry) {
    let entries = JSON.parse(localStorage.getItem("entries")) || [];
    entries.push(entry);
    localStorage.setItem("entries", JSON.stringify(entries));
}

function addEntryToTable(entry) {
    const tableBody = document.querySelector("#entriesTable tbody");
    const row = tableBody.insertRow();
    row.insertCell(0).textContent = entry.name;
    row.insertCell(1).textContent = entry.email;
    row.insertCell(2).textContent = entry.password;
    row.insertCell(3).textContent = entry.dob;
    row.insertCell(4).textContent = entry.termsAccepted;
}

function loadEntries() {
    const entries = JSON.parse(localStorage.getItem("entries")) || [];
    entries.forEach(addEntryToTable);
}

// Load saved entries when the page loads
document.addEventListener("DOMContentLoaded", loadEntries);
