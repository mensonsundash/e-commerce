
// Sample product data
const sampleProducts = [
    { id: 1, name: "Wireless Mouse", category: "electronics", price: 29.99, inStock: 10 },
    { id: 2, name: "T-Shirt", category: "clothing", price: 19.99, inStock: 0 },
    { id: 3, name: "Bluetooth Headphones", category: "electronics", price: 49.99, inStock: 12 },
    { id: 4, name: "Jeans", category: "clothing", price: 39.99, inStock: 4 },
    { id: 5, name: "Ear Buds", category: "electronics", price: 236.99, inStock: 23 },
    { id: 6, name: "Mashimo Boots", category: "clothing", price: 124, inStock: 15 }
];
//variable DECLARATION
let products = [];
let loggedInUser = null;

/**
 * Loading windows on PAGELOAD
 */

window.onload = function() {

    if(sessionStorage.getItem("loggedInUser")){
        loggedInUser = JSON.parse(sessionStorage.getItem("loggedInUser"))
    }
    
    if(!loggedInUser || loggedInUser.role !== "admin"){
        alert('Access denied. Only admins allowed.')
        window.location.href = "index.html";
        
    } else {
        document.getElementById("adminWelcome").textContent = `Welcome, ${loggedInUser.name}`;

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


// /**
//  * PRODUCT functions
//  */
// function listProduct() {
//     if(!products){
//         products = sampleProducts;
//     }
// }
// function addProduct(){

// }

// function updateProduct(){

// }

// function deleteProduct(id) {

// }

