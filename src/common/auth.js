import { setToStorage, getFromStorage, setToSession, getFromSession } from "./utils.js";
import { closeModal, resetForm } from "./dom.js";

export let users = [];//Initialize empty users
export let loggedInUser = null;//Initialize empty logged in user

function loadUser(){
    const stored = getFromStorage('users');
    users = stored;
}

function loadLoggedInUser() {
    const stored = getFromSession('loggedInUser');
    loggedInUser = stored;
}


// registration function
function registerUser(e){
    e.preventDefault();
    
    const name = document.getElementById("registerName").value.trim();
    const email = document.getElementById("registerEmail").value.trim();
    const password = document.getElementById("registerPassword").value.trim();
    
    if (!name || !email || !password) {
        alert("All fields are required");
        return;
    }

    if(users.find(u => u.email === email)){
        return alert("Email already registered");
    }

    const newUser = {
        id: Date.now(),
        name,
        email,
        password,
        role: email === "admin@example.com" ? "admin" : "user"
    };

    users.push(newUser);
    
    setToStorage("users", users);
    alert("Registration successful! Please log in.");
    closeModal("registerModal");
}

function loginUser(e){
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value.trim();
    const accountSection = document.getElementById('accountSection');
    

    const user = users.find( u => u.email === email && u.password === password);

    if(!user){
        return alert("Invalid Credentials");
    }

    loggedInUser = user;
    
    setToSession("loggedInUser", loggedInUser);
    accountSection.classList.add("hidden");
    alert(`Welcome ${loggedInUser.name}`);

    if(user.role === "admin"){
        window.location.href = "./src/admin/admin.html" //redirect to admin panel
    }else if(user.role === "user") {
        closeModal('loginModal');
        resetForm('loginForm');
        updateAuthUI();
    }

    
}

function logoutUser() {
    const userPanel = document.getElementById('userPanel');
    const accountSection = document.getElementById('accountSection');
    userPanel.classList.add("hidden");
    accountSection.classList.remove("hidden");

    // localStorage.removeItem("loggedInUser");
    sessionStorage.removeItem("loggedInUser");
    loggedInUser = null;
    updateAuthUI();
}

function updateAuthUI(){
    const accountSection = document.getElementById('accountSection');
    const userPanel = document.getElementById("userPanel");
    const welcomeText = document.getElementById("welcomeText");

    if(loggedInUser){
        userPanel.classList.remove("hidden");
        accountSection.classList.add("hidden");
        welcomeText.textContent = `Welcome, ${loggedInUser.name}`;
    }else{
        userPanel.classList.add("hidden");
        accountSection.classList.remove("hidden");
    }
    // window.location.href = "./index.html" //redirect to admin panel
}

export { loadUser, loadLoggedInUser, registerUser, loginUser, logoutUser, updateAuthUI }

