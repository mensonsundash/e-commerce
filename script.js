// Sample product data
const products = [
  { id: 1, name: "Wireless Mouse", category: "electronics", price: 29.99, inStock: true },
  { id: 2, name: "T-Shirt", category: "clothing", price: 19.99, inStock: false },
  { id: 3, name: "Bluetooth Headphones", category: "electronics", price: 49.99, inStock: true },
  { id: 4, name: "Jeans", category: "clothing", price: 39.99, inStock: true }
];

/**
 * Variable Initialization/assignment
 */
//Event listeners
const inputTagsClass = [
    "searchInput", 
    "categoryFilter", 
    "minPrice", 
    "maxPrice", 
    "inStockOnly"
];

//Initialize empty cart array
let cart = [];

/**
 * loading windows on page load
 */

window.onload = function () {
    // loading products according to filters
    getFilteredProducts();

    //checking localstorage for cart
    if(localStorage.getItem("cart")){
        cart = JSON.parse(localStorage.getItem("cart"));//parsing JSON data
    }
    renderCartSummary();//rendering cartSummary

    
}


/**
 * Trigger Events
 */

//Loop through all tags id
inputTagsClass.forEach( id => {
    document.getElementById(id).addEventListener("input", getFilteredProducts);
    document.getElementById(id).addEventListener("change", getFilteredProducts);
})



/**
 * Utility Functions
 */

//filter bycategory
function filterByCategory(products, category, partial = false) {
    
    if(!Array.isArray(products)|| !category)  return [];
    
    const categoryLower = category.toLowerCase();

    

    return products.filter(product => {
        const productCategoryLower = product.category.toLowerCase();
        return partial ? productCategoryLower.includes(categoryLower) : productCategoryLower === categoryLower;
    })
}

//filter by price range
function filterByPriceRange(products, min, max) {

    if(!Array.isArray(products) || typeof min !== 'number' || typeof max !== 'number') return [];
    if(min > max) [min, max] = [max, min];

    return products.filter(product => product.price >= min && product.price <= max);
}

//searching products
function searchByKeyword(products, keywords) {
    const keywordLower = keywords.toLowerCase();

    if(!Array.isArray(products) || !keywords) return products;

    return products.filter(product => {
        const productName = product.name.toLowerCase();
        const productCategory = product.category.toLowerCase();
        
        return productName.includes(keywordLower) || productCategory.includes(keywordLower);
    });
}

//stock availability check
function getAvailableProducts(products) {
    return products.filter(product => product.inStock);
}

//toggle cartsidebar
function toggleCart(){
    const cartsidebar = document.getElementById('cartSidebar');
    cartsidebar.classList.toggle('visible');
}


/**
 * Resulting Functions
 */
//filtered product combined
function getFilteredProducts() {
    let filtered = [...products];

    const search = document.getElementById('searchInput').value;
    const category = document.getElementById('categoryFilter').value;
    const minPrice = parseFloat(document.getElementById('minPrice').value) || 0;
    const maxPrice = parseFloat(document.getElementById('maxPrice').value);
    const inStockOnly = document.getElementById('inStockOnly').checked;

    if(search) filtered = searchByKeyword(filtered, search);
    if(category) filtered = filterByCategory(filtered, category);
    if(minPrice || maxPrice) filtered = filterByPriceRange(filtered, minPrice, maxPrice);
    if(inStockOnly) filtered = getAvailableProducts(filtered);
    
    displayProducts(filtered);
}

//display products UI Rendered
function displayProducts(productArray) {
    const container = document.getElementById('productList');

    container.innerHTML = '';

    if(productArray.length === 0) {
        container.innerHTML = '<p> No Product Found.</p>';
        return;
    }

    productArray.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <h3>${product.name}</h3>
            <p>Category: ${product.category}</p>
            <p>Price: ${product.price.toFixed(2)}</P>
            <p>${product.inStock ? "✅ In Stock" : "❌ Out of Stock"}</p>
            <button class="add-to-cart-btn" onclick="handleAddToCart(${product.id})">Add to cart</button>
        `;// <button class="add-to-cart-btn" data-id="${product.id}">Add to cart</button>
        container.appendChild(card);
    });

}

//handling Add To cart
function handleAddToCart(productId) {
    const product = products.find( p => p.id === productId);
    console.log("Added Product into Cart: ", product)
    addToCart(product);
    renderCartSummary();
}

//add product into cart
function addToCart(product) {
    let existingItem = -1; //set cart as empty
    
    if(localStorage.getItem("cart")){
        cart = JSON.parse(localStorage.getItem("cart"));
        existingItem = cart.findIndex( item => item.id === product.id);
    }
    
    if(existingItem > -1) {
        console.log("if cart has something");
        cart[existingItem].quantity += 1;
    }else {
        console.log("if cart is empty");
        cart.push({ ...product, quantity: 1 });
    }

    
    localStorage.setItem("cart", JSON.stringify(cart));
    alert(`${product.name} added to cart`);
    toggleCart();
}

//update cart while +/- of the quantity
function updateQuantity(productId, newQty) {
    if(localStorage.getItem("cart")){
        cart = JSON.parse(localStorage.getItem("cart"));
        const item = cart.find( p => p.id === productId);
        
        if(item){
            item.quantity = newQty;
            localStorage.setItem("cart", JSON.stringify(cart));
            renderCartSummary();
        }
    }
    
    
}

//render the added products in cart summary
function renderCartSummary() {
    
    const cartList = document.getElementById('cartList');
    const cartTotal = document.getElementById('cartTotal');
    const cartCount = document.getElementById('cartCount');
    

    cartList.innerHTML = '';
    console.log("rendered Cart:", cart)
    if(cart.length === 0) {
        cartList.innerHTML = "<p>Cart is empty.</p>";
        cartCount.textContent = 0;
        cartTotal.textContent = '';
        return;
    }

    let total = 0;
    // let cartCountValue = 0;

    cart.forEach( item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;

        const div = document.createElement('div');
        const quantityCounts = [1,2,3,4,5,6,7,8,9,10];
        div.classList.add('cart-item');
        div.innerHTML = `
            <span class="item-name">${item.name}</span>
            <select class="qty-selector" onchange="updateQuantity(${item.id}, this.value)">
                ${
                    quantityCounts.map(qty => 
                        `<option value="${qty}" ${qty === parseInt(item.quantity) ? "selected": ""}>${qty}</option>`
                    )
                } 
            </select>
            
            <span class="item-price">$${item.price.toFixed(2)}</span>
            <button class="remove-btn" onclick="removeFromCart(${item.id})"> ❌ </button>
        `;//<span class="item-qty">${item.quantity}</span>
        cartList.appendChild(div);
    });
    
    cartCount.textContent =  cart.length;
    cartTotal.textContent = `Total: $${total.toFixed(2)}`;
}

//remove product from cart
function removeFromCart(id) {
    // filter product from cart that is not with remove item id
    cart = cart.filter(item => item.id !== id);
    //update localStorage Cart item without remove id
    localStorage.setItem("cart", JSON.stringify(cart));
    renderCartSummary();
}

//clear cart 
function clearCart() {
    // clear the cart array statement
    cart = [];
    localStorage.removeItem("cart");
    renderCartSummary();
}

