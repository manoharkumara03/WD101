document.addEventListener("DOMContentLoaded", function () {
    const email = document.getElementById("email");
    const password = document.getElementById("password");
    const nameInput = document.getElementById("name");
    const dobInput = document.getElementById("dob");
    const termsInput = document.getElementById("acceptTerms");

    const emailError = document.getElementById("email-error");
    const nameError = document.getElementById("name-error");
    const passwordError = document.getElementById("password-error");
    const dobError = document.getElementById("dob-error");
    const termsError = document.getElementById("terms-error");
    const successMessage = document.getElementById("form-success");

    email.addEventListener("input", () => validateEmail(email));
    password.addEventListener("input", updatePasswordStrength);
    nameInput.addEventListener("input", validateName);
    dobInput.addEventListener("input", validateDob);
    termsInput.addEventListener("change", validateTerms);

    const today = new Date();
    const minAge = 18;
    const maxAge = 55;

    const minDate = new Date(today.getFullYear() - maxAge, today.getMonth(), today.getDate() + 1);
    const maxDate = new Date(today.getFullYear() - minAge, today.getMonth(), today.getDate() + 1);

    dobInput.min = minDate.toISOString().split("T")[0];
    dobInput.max = maxDate.toISOString().split("T")[0];

    function validateEmail(element) {
        const value = element.value;
        let message = "";

        if (value === "") {
            message = "Email cannot be blank.";
        } else if (!/@/.test(value)) {
            message = "Email must contain '@'.";
        } else if (!/\./.test(value.split("@")[1])) {
            message = "Email must contain '.' after '@'.";
        } else {
            message = "";
        }

        emailError.textContent = message;
        emailError.classList.toggle("hidden", message === "");
    }

    function updatePasswordStrength() {
        const meter = document.getElementById("password-strength-meter");
        const val = password.value;
        let score = 0;
        if (val.length > 7) score++;
        if (/[a-z]/.test(val) && /[A-Z]/.test(val)) score++;
        if (/\d/.test(val)) score++;
        if (/[@$!%*?&#]/.test(val)) score++;

        meter.value = score;
    }

    function validateName() {
        nameError.classList.toggle("hidden", nameInput.value.trim() !== "");
    }

    function validateDob() {
        dobError.classList.toggle("hidden", dobInput.value !== "");
    }

    function validateTerms() {
        termsError.classList.toggle("hidden", termsInput.checked);
    }

    const userForm = document.getElementById("user-form");

    function saveUserForm(event) {
        event.preventDefault();

        if (!validateForm()) return;

        const entry = {
            name: nameInput.value,
            email: email.value,
            password: password.value,
            dob: dobInput.value,
            termsandconditions: termsInput.checked,
        };

        let userEntries = retrieveEntries();
        userEntries.push(entry);

        localStorage.setItem("users", JSON.stringify(userEntries));
        displayEntries();

        userForm.reset(); // Resets the form to allow multiple entries
        successMessage.classList.remove("hidden");
        setTimeout(() => successMessage.classList.add("hidden"), 3000);
    }

    userForm.addEventListener("submit", saveUserForm);

    function validateForm() {
        validateName();
        validateEmail(email);
        validateDob();
        validateTerms();

        return nameInput.value.trim() !== "" &&
            email.validity.valid &&
            password.value !== "" &&
            dobInput.value !== "" &&
            termsInput.checked;
    }

    function retrieveEntries() {
        let entries = localStorage.getItem("users");
        if (entries) {
            return JSON.parse(entries);
        } else {
            return [];
        }
    }

    function deleteEntry(index) {
        let userEntries = retrieveEntries();
        userEntries.splice(index, 1);
        localStorage.setItem("users", JSON.stringify(userEntries));
        displayEntries();
    }

    function displayEntries() {
        const entries = retrieveEntries();
        const tableEntries = entries.map((entry, index) => {
            const namec = `<td class='border px-4 py-2'>${entry.name}</td>`;
            const emailc = `<td class='border px-4 py-2'>${entry.email}</td>`;
            const passwordc = `<td class='border px-4 py-2'>${entry.password}</td>`;
            const dobc = `<td class='border px-4 py-2'>${entry.dob}</td>`;
            const acceptTermsc = `<td class='border px-4 py-2'>${entry.termsandconditions ? "Yes" : "No"}</td>`;
            const deleteButton = `<td class='border px-4 py-2 text-center'><button onclick="deleteEntry(${index})" class="text-red-500 hover:text-red-700">Delete</button></td>`;

            return `<tr>${namec}${emailc}${passwordc}${dobc}${acceptTermsc}${deleteButton}</tr>`;
        }).join("\n");

        const table = `<table class="table table-striped">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Password</th>
              <th>Dob</th>
              <th>Accepted Terms?</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>${tableEntries}</tbody>
        </table>`;

        document.getElementById("user-entries").innerHTML = table;
    }

    displayEntries(); // Initializes table with existing entries on page load
});
