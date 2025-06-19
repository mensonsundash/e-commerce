const loggedInUser = JSON.parse(sessionStorage.getItem("loggedInUser"))

if(!loggedInUser || loggedInUser.role !== "admin"){
    alert('Access denied. Only admins allowed.')
    window.location.href = "index.html";
    
} else {
    document.getElementById("adminWelcome").textContent = `Welcome back, ${loggedInUser.name}`;

}

function logoutAdmin() {
    sessionStorage.removeItem("loggedInUser");
    window.location.href = "index.html"
}

function toggleProfile() {

    const popup = document.getElementById("profilePopup");
    popup.style.display = popup.style.display === "block" ? "none": "block";
}