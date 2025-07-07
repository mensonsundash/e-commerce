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

function redirectToHome() {
    const { origin, pathname } = window.location;
    const basePath = pathname.split('/').slice(0, pathname.split('/').indexOf('e-commerce') + 1).join('/');
    window.location.href = `${origin}${basePath}/index.html`;
}

export { setToStorage, getFromStorage, setToSession, getFromSession, redirectToHome };