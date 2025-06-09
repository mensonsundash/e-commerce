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
}

//render the added products in cart summary
function renderCartSummary() {
    
    const cartList = document.getElementById('cartList');
    const cartTotal = document.getElementById('cartTotal');
    const cartCount = document.getElementById('cartCount');

    cartList.innerHTML = '';

    if(cart.length === 0) {
        cartList.innerHTML = "<p>Cart is empty.</p>";
        cartTotal.textContent = '';
        return;
    }

    let total = 0;
    // let cartCountValue = 0;

    cart.forEach( item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;

        const div = document.createElement('div');

        div.classList.add('product-card');
        div.innerHTML = `
            <h4>${item.name}</h4>
            <p>Price: $${item.price.toFixed(2)} x ${item.quantity} = $${itemTotal.toFixed(2)}</p>
            <button onclick="removeFromCart(${item.id})"> ❌ Remove </button>
        `;
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

/**
 * Trigger Events
 */

//Loop through all tags id
inputTagsClass.forEach( id => {
    document.getElementById(id).addEventListener("input", getFilteredProducts);
    document.getElementById(id).addEventListener("change", getFilteredProducts);
})

/**
 * function calling
 */
// Initial display
getFilteredProducts();