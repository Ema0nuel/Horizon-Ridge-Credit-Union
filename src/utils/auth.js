import { showToast } from "../components/toast";

/**
 * Checks password strength and returns an object with score and label.
 * @param {string} password
 * @returns {{score: number, label: string, color: string}}
 */
export function checkPasswordStrength(password) {
    let score = 0;
    if (!password) return { score, label: "Empty", color: "bg-gray-300" };
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 2) return { score, label: "Weak", color: "bg-red-500" };
    if (score === 3) return { score, label: "Medium", color: "bg-yellow-500" };
    if (score >= 4) return { score, label: "Strong", color: "bg-green-500" };
}

/**
 * Validate signup form fields.
 * @param {HTMLFormElement} form
 * @returns {boolean}
 */
export function validateSignupForm(form) {
    const fields = [
        { id: "firstname", name: "First Name" },
        { id: "lastname", name: "Last Name" },
        { id: "email", name: "Email" },
        { id: "password", name: "Password" },
        { id: "title", name: "Title" },
        { id: "selectcountry", name: "Country Code" },
        { id: "phone1", name: "Telephone" },
        { id: "country", name: "Nationality" },
        { id: "uaddress", name: "Address" },
        { id: "city", name: "City" },
        { id: "state", name: "State" },
        { id: "zip", name: "Zip Code" },
        { id: "dob", name: "Date of Birth" },
        { id: "occupation", name: "Occupation" },
        { id: "ssn", name: "SSN" },
        { id: "marital", name: "Marital Status", type: "radio" },
        { id: "gender", name: "Gender", type: "radio" },
        { id: "acctype", name: "Account Type", type: "radio" },
        { id: "question", name: "Security Question" },
        { id: "answer", name: "Security Answer" },
        { id: "account_pin", name: "Account Pin" },
    ];

    for (const field of fields) {
        let el;
        if (field.type === "radio") {
            el = form.querySelector(`input[name="${field.id}"]:checked`);
        } else {
            el = form.querySelector(`#${field.id}`);
        }
        if (!el || !el.value) {
            showToast(`${field.name} is required.`, "error");
            el?.focus();
            return false;
        }
        // Email format
        if (field.id === "email" && !/^[\w-.]+@([\w-]+\.)+[\w-]{2,}$/.test(el.value)) {
            showToast("Invalid email address.", "error");
            el.focus();
            return false;
        }
        // Phone format
        if (field.id === "phone1" && !/^[0-9 ]{5,15}$/.test(el.value)) {
            showToast("Invalid phone number.", "error");
            el.focus();
            return false;
        }
        // Zip code
        if (field.id === "zip" && !/^[0-9]{5,8}$/.test(el.value)) {
            showToast("Invalid zip code.", "error");
            el.focus();
            return false;
        }
        // Password strength
        if (field.id === "password") {
            const strength = checkPasswordStrength(el.value);
            if (strength.score < 4) {
                showToast("Password is too weak. Use upper, lower, number, symbol.", "error");
                el.focus();
                return false;
            }
        }
    }
    showToast("All fields look good!", "success");
    return true;
}

/**
 * Validate login form fields.
 * @param {HTMLFormElement} form
 * @returns {boolean}
 */
export function validateLoginForm(form) {
    const email = form.querySelector("#accessID");
    const pwd = form.querySelector("#txt_pwd");
    if (!email || !email.value) {
        showToast("Access ID is required.", "error");
        email?.focus();
        return false;
    }
    if (!pwd || !pwd.value) {
        showToast("Password is required.", "error");
        pwd?.focus();
        return false;
    }
    if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,}$/.test(email.value)) {
        showToast("Invalid email address.", "error");
        email.focus();
        return false;
    }
    if (pwd.value.length < 8) {
        showToast("Password must be at least 8 characters.", "error");
        pwd.focus();
        return false;
    }
    showToast("Login fields look good!", "success");
    return true;
}