document.addEventListener('DOMContentLoaded', () => {
    loadEntries();

    document.getElementById('registrationForm').addEventListener('submit', function(event) {
        event.preventDefault();
        const emailField = event.target.email;
        const email = emailField.value;

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            alert('Please enter a valid email address.');
            emailField.focus();
            return;
        }

        const dobField = event.target.dob;
        const dob = new Date(dobField.value);
        const today = new Date();
        let age = today.getFullYear() - dob.getFullYear();
        const monthDiff = today.getMonth() - dob.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
            age--;
        }

        if (age < 18 || age > 55) {
            alert('Age must be between 18 and 55 years.');
            dobField.focus();
            return;
        }

        const name = event.target.name.value;
        const password = event.target.password.value;
        const terms = event.target.terms.checked ? 'Yes' : 'No';

        const newEntry = { name, email, password, dob: dobField.value, terms };

        let entries = JSON.parse(localStorage.getItem('entries')) || [];

        entries.push(newEntry);


        localStorage.setItem('entries', JSON.stringify(entries));

        appendEntryToTable(newEntry);

        event.target.reset();
    });
});

function loadEntries() {
    const entries = JSON.parse(localStorage.getItem('entries')) || [];
    entries.forEach(entry => appendEntryToTable(entry));
}

function appendEntryToTable(entry) {
    const newRow = document.createElement('tr');
    newRow.innerHTML = `
        <td>${entry.name}</td>
        <td>${entry.email}</td>
        <td>${entry.password}</td>
        <td>${entry.dob}</td>
        <td>${entry.terms}</td>
    `;
    document.getElementById('entries').appendChild(newRow);
}
