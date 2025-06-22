import { productsArr } from "./sample-product.js";
//variable DECLARATION
let products = [];
let loggedInUser = null;

/**
 * added to global window with global scope to functions 
 * to call them from HTML as script type ="module" everything is scoped inside the module,
 * and nothing is attached to window unless explicitly do it
 */
window.toggleProfile = toggleProfile;
window.logoutAdmin = logoutAdmin;
window.listProduct = listProduct;
window.addProduct = addProduct;
window.dashboard = dashboard;

/**
 * Loading windows on PAGELOAD
 */
window.onload = function() {

    showSection("dashboardSection");//loading defautl dashboard by making all other tabs hidden

    if(!localStorage.getItem("products")){
        localStorage.setItem("products", JSON.stringify(productsArr));
    }

    if(localStorage.getItem("products")){
        products = JSON.parse(localStorage.getItem("products"));
    }

    if(sessionStorage.getItem("loggedInUser")){
        loggedInUser = JSON.parse(sessionStorage.getItem("loggedInUser"))
    }
    
    if(!loggedInUser || loggedInUser.role !== "admin"){
        alert('Access denied. Only admins allowed.')
        window.location.href = "index.html";
        
    } else {
        document.getElementById("dashboardSection").textContent = `Welcome, ${loggedInUser.name}`;

    }
}

/**
 * UTILITIES function
 */

function toggleProfile() {

    const popup = document.getElementById("profilePopup");
    popup.classList.toggle("visible");
}

function logoutAdmin() {
    sessionStorage.removeItem("loggedInUser");
    window.location.href = "index.html"
}


/**
 * PRODUCT functions
 */
function dashboard() {
    showSection("dashboardSection");

    let dashboard = document.getElementById("dashboardSection");
    
    dashboard.textContent = `Welcome, ${loggedInUser.name}`;
}
function listProduct() {
    showSection("productListSection");

    const tableBody = document.getElementById("productTable");
    tableBody.innerHTML = "";

    if(products){
        products.forEach(product => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${product.name}</td>
                <td>${product.category}</td>
                <td>$${product.price.toFixed(2)}</td>
                <td>${parseInt(product.inStock)}</td>
                <td>
                    <button class="action-btn edit-btn" onclick="editProduct(${product.id})">Edit</button>
                    <button class="action-btn delete-btn" onclick="deleteProduct(${product.id})">Delete</button>
                </td>
            `;
            
                
                tableBody.appendChild(tr);
            }
            
        );
        
    }
}
function addProduct(){

}

function updateProduct(){

}

function deleteProduct(id) {

}

function showSection (sectionId) {
    const allSections = document.querySelectorAll('.content-section');

    allSections.forEach(section => section.classList.add("hidden"));
    const targetSection = document.getElementById(sectionId);
    if(targetSection) targetSection.classList.remove("hidden");
}

