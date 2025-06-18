const loggedInUser = JSON.parse(sessionStorage.getItem("loggedInUser"))

if(!loggedInUser || loggedInUser.role !== "admin"){
    alert('Access denied. Only admins allowed.')
    window.location.href = "index.html";
} else {
    document.getElementById("adminWelcome").textContent = `Welcome back, Admin ${loggedInUser.name}`;

}

function logoutAdmin() {
    sessionStorage.removeItem("loggedInUser");
    window.location.href = "index.html"
}