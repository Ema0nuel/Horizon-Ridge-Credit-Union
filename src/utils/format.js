export function formatCountry(countryCode) {
    return countryCode.toUpperCase();
}

export function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

export function capitalizeWords(str = "") {
    return str.replace(/\b\w/g, char => char.toUpperCase());
}

export function formatPhone(phone) {
    return phone.replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3");
}

export function maskAccountNumber(accountNumber) {
    return accountNumber.replace(/.(?=.{4})/g, "*");
}

export function formatTime(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit"
    });
}

export function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric"
    });
}

export function formatCurrency(amount, currency = "USD") {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency,
        minimumFractionDigits: 2
    }).format(amount || 0);
}
