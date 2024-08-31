document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('registrationForm');
    const userTable = document.getElementById('userTable').querySelector('tbody');
    
    // Load data from localStorage
    const users = JSON.parse(localStorage.getItem('users')) || [];

    const displayUsers = () => {
        userTable.innerHTML = '';
        users.forEach(user => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td>${user.password}</td>
                <td>${user.dob}</td>
                <td>${user.terms ? 'Yes' : 'No'}</td>
            `;
            userTable.appendChild(row);
        });
    };

    const validateDob = (dob) => {
        const birthDate = new Date(dob);
        const today = new Date();
        const age = today.getFullYear() - birthDate.getFullYear();
        const monthDifference = today.getMonth() - birthDate.getMonth();
        const dayDifference = today.getDate() - birthDate.getDate();
        
        // Check if the user is exactly 18 or older but not older than 55
        if (monthDifference < 0 || (monthDifference === 0 && dayDifference < 0)) {
            age--;
        }
        return age >= 18 && age <= 55;
    };

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const dob = document.getElementById('dob').value;
        const terms = document.getElementById('terms').checked;

        if (!validateDob(dob)) {
            alert('You must be between 18 and 55 years old to register.');
            return;
        }

        const newUser = { name, email, password, dob, terms };
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        displayUsers();

        form.reset(); // Reset the form after submission
    });

    // Initial display of users from localStorage
    displayUsers();
});
