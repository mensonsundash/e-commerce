function setToStorage(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

function getFromStorage(key, fallback = null) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
}

function setToSession(key, value) {
    sessionStorage.setItem(key, JSON.stringify(value));
}

function getFromSession(key) {
    const data = sessionStorage.getItem(key);
    return data ? JSON.parse(data) : null;
}

export { setToStorage, getFromStorage, setToSession, getFromSession };