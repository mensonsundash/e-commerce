import { productsArr } from "./sample-product.js";

//variable DECLARATION
let products = [];
let loggedInUser = null;
let editingId = null;

/**
 * added to global window with global scope to functions 
 * to call them from HTML as script type ="module" everything is scoped inside the module,
 * and nothing is attached to window unless explicitly do it
 */
window.toggleProfile = toggleProfile;
window.logoutAdmin = logoutAdmin;
window.listProduct = listProduct;
window.addProductModal = addProductModal;
window.addProduct = addProduct;
window.editProduct = editProduct;
window.deleteProduct = deleteProduct;
window.dashboard = dashboard;
window.openModal = openModal;
window.closeModal = closeModal;
window.resetForm = resetForm;
/**
 * Loading windows on PAGELOAD
 */
window.onload = function() {

    showSection("dashboardSection");//loading default dashboard by making all other tabs hidden
    
    if(!localStorage.getItem("products") || JSON.parse(localStorage.getItem("products")).length === 0){
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
 * UTILITY functions
 */

function toggleProfile() {

    const popup = document.getElementById("profilePopup");
    popup.classList.toggle("visible");
}

function logoutAdmin() {
    sessionStorage.removeItem("loggedInUser");
    window.location.href = "index.html"
}

function getFilteredProducts() {
    let filtered = [...products];//spread operator to make separate from original variable `products`

    const search = document.getElementById("searchInput").value;

    if(search) filtered = searchByKeywords(filtered, search);

    renderProducts(filtered);
}

function searchByKeywords(filterProduct, keywords){
    const keywordsLower = keywords.toLowerCase();
    if(!Array.isArray(filterProduct) || !keywords) return filterProduct;

    return filterProduct.filter( p => {
        const productName = p.name.toLowerCase();;
        const category = p.category.toLowerCase();

        return productName.includes(keywordsLower) || category.includes(keywordsLower);
    });

}

function renderProducts(ProductArray) {
    const tableBody = document.getElementById("productTable");
    tableBody.innerHTML = "";

    if(ProductArray.length === 0){
        tableBody.innerHTML = "No Products found."
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
        }
        
    );
    
}

function openModal(modalId){
    document.getElementById(modalId).classList.remove('hidden');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.add('hidden');
    resetForm("productForm");
}

function resetForm(formId){
    editingId = null;
    document.getElementById(formId).reset();
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



/**
 * Admin panel Product controls
 */
function addProductModal(){
    const productHeader = document.getElementById("productHeader");
    const productSubmit = document.getElementById("productSubmit");
    productHeader.textContent = "Add Product";
    productSubmit.textContent = "Add";

    resetForm("productForm");
    openModal("productModal");
    
    document.getElementById("productForm").addEventListener("submit", addProduct);
}

function addProduct(e){
    e.preventDefault();

    const name = document.getElementById("productName").value.trim();
    const category = document.getElementById("productCategory").value.trim();
    const price = parseFloat(document.getElementById("productPrice").value || 0);
    const inStock = parseInt(document.getElementById("productStock").value || 0);

    if(!name || !category || !price || !inStock){
        alert("All field are required.");
        return;
    }

    //restricting duplicate product
    const existinProduct = products.find(p => p.name.toLowerCase() === name.toLowerCase() && p.category.toLowerCase() === category.toLowerCase());
    if(existinProduct){
        alert(`"${existinProduct.name}" already Exist with "${existinProduct.category}" category.`);
        return;
    }
    
    const newProduct = {
        id: Date.now(),
        name,
        category,
        price,
        inStock
    };

    products.push(newProduct);

    localStorage.setItem("products", JSON.stringify(products));
    
    closeModal("productModal");
    listProduct();

}

function editProduct(productId) {
    openModal("productModal");
    editingId = productId;
    const productHeader = document.getElementById("productHeader");
    const productSubmit = document.getElementById("productSubmit");
    productHeader.textContent = "Update Product";
    productSubmit.textContent = "Update";

    const product = products.find(p => p.id === productId)
    document.getElementById("productName").value = product.name;
    document.getElementById("productCategory").value = product.category;
    document.getElementById("productPrice").value = product.price;
    document.getElementById("productStock").value = product.inStock;

    // calling event listenere for submit to call update function
    document.getElementById("productForm").addEventListener("submit", updateProduct);
    
}
function updateProduct(e){
    e.preventDefault();

    const indexing = products.findIndex(p => p.id === editingId);
    if(indexing !== -1){
        const name = document.getElementById("productName").value.trim();
        const category = document.getElementById("productCategory").value.trim();
        const price = parseFloat(document.getElementById("productPrice").value.trim());
        const inStock = parseInt(document.getElementById("productStock").value.trim());

        if(!name || !category || !price || !inStock){
            alert("All field are required.");
            return;
        }
        
        //restricting duplicate product
        const existinProduct = products.find(p => p.name.toLowerCase() === name.toLowerCase() && p.category.toLowerCase() === category.toLowerCase());
        if(existinProduct){
            alert(`"${existinProduct.name}" already Exist with "${existinProduct.category}" category.`);
            return;
        }

        products[indexing] = {
            id: editingId,
            name,
            category,
            price,
            inStock
        };

        localStorage.setItem("products", JSON.stringify(products));
        
        closeModal("productModal");
        listProduct();
    }
    

}

function deleteProduct(id) {
    const index = products.findIndex(p => p.id === id);
    const producFind = products.find(p => p.id === id);
    const timeout = 500;// 500 ms = 5 s
    if(confirm(`Are you sure? you want to delete "${producFind.name}".`)) {
        
        setTimeout(() => {
            if(index !== -1){
                products.splice(index, 1)
                localStorage.setItem("products", JSON.stringify(products));
                listProduct();
            }
        }, timeout);

        
    }

}

function showSection (sectionId) {
    const allSections = document.querySelectorAll('.content-section');

    allSections.forEach(section => section.classList.add("hidden"));
    const targetSection = document.getElementById(sectionId);
    if(targetSection) targetSection.classList.remove("hidden");
}