import { getFilteredProducts } from "../admin/products.js";
import { loggedInUser } from "./auth.js";

//ADMIN toggle for login/logout
function toggleProfile(toggleId) {
    const popup = document.getElementById(toggleId);
    popup.classList.toggle("visible");
}

function renderProducts(ProductArray) {
    const tableBody = document.getElementById("productTable");
    tableBody.innerHTML = "";

    if(ProductArray.length === 0){
        tableBody.innerHTML = "No Products found.";
        return;
    }

    
    ProductArray.forEach(product => {
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
    });
}


/**
 * PRODUCT Navigation functions
 */
function dashboard() {
    showSection("dashboardSection");

    let dashboard = document.getElementById("dashboardSection");
    
    dashboard.textContent = `Welcome, ${loggedInUser.name}`;
}

function listProduct() {
    showSection("productListSection");

    document.getElementById("searchInput").addEventListener("input", getFilteredProducts)
    
    getFilteredProducts();
}

function showSection (sectionId) {
    const allSections = document.querySelectorAll('.content-section');

    allSections.forEach(section => section.classList.add("hidden"));
    const targetSection = document.getElementById(sectionId);
    if(targetSection) targetSection.classList.remove("hidden");
}

export { dashboard, listProduct, showSection, toggleProfile, renderProducts };