// Sample product data
const products = [
  { id: 1, name: "Wireless Mouse", category: "electronics", price: 29.99, inStock: 10 },
  { id: 2, name: "T-Shirt", category: "clothing", price: 19.99, inStock: 0 },
  { id: 3, name: "Bluetooth Headphones", category: "electronics", price: 49.99, inStock: 12 },
  { id: 4, name: "Jeans", category: "clothing", price: 39.99, inStock: 4 }
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

//Variable Declaration 
let cart = []; //Initialize empty cart array
let wishlist = []; //Initialize empty wishlist

/**
 * loading windows on page load
 */

window.onload = function () {
    // loading products according to filters
    getFilteredProducts();

    // if(wishlist.length === 0){
    //     wishlistList.innerHTML = "<p>Your wishlist is empty.</p>";
    //     return;
    // }

    //checking localstorage for cart
    if(localStorage.getItem("cart")){
        cart = JSON.parse(localStorage.getItem("cart"));//parsing JSON data
        
    }

    //checking localstorage for wishlist
    if(localStorage.getItem("wishlist")) {
        wishlist = JSON.parse(localStorage.getItem("wishlist"));
        
    }


    renderCartSummary();//rendering cartSummary
    renderWishlist();//rendering wishlist
    
    
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
    return products.filter(product => product.inStock > 0);
}

//toggle cartsidebar
function toggleCart(){
    const cartsidebar = document.getElementById('cartSidebar');
    cartsidebar.classList.toggle('visible');
}

//toggle wishlist
function toggleWishlist(){
    const wishlistSidebar = document.getElementById('wishlistSidebar');
    wishlistSidebar.classList.toggle('visible');
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
            <p>${product.inStock > 0 ? "✅ In Stock" : "❌ Out of Stock"}</p>
            <button class="add-to-cart-btn" onclick="handleAddToCart(${product.id})">Add to cart</button>
            <button class="wishlist-btn" onclick="handleWishlist(${product.id})">❤️ Wishlist</button>
        `;// <button class="add-to-cart-btn" data-id="${product.id}">Add to cart</button>
        container.appendChild(card);
    });

}

//handling Add To cart
function handleAddToCart(productId) {
    const product = products.find( p => p.id === productId);
    addToCart(product);
    renderCartSummary();
}

//add product into cart
function addToCart(product) {
    let existingItem = -1; //set cart as empty
    
    const productStock = product.inStock;//checking product stock

    if(productStock <= 0){
        alert(`You can't add ${product.name} into cart. It is out of stock.`);
        return;
    }


    if(localStorage.getItem("cart")){
        cart = JSON.parse(localStorage.getItem("cart"));
        existingItem = cart.findIndex( item => item.id === product.id);
    }
    
    if(existingItem > -1) {
        cart[existingItem].quantity += 1;
    }else {
        cart.push({ ...product, quantity: 1 });
    }

    removeFromWishlist(product.id)

    
    localStorage.setItem("cart", JSON.stringify(cart));
    alert(`${product.name} added to cart`);
    toggleCart();
    

}

//update cart while +/- of the quantity
function updateQuantity(id, qtyChange) {
    const index = cart.findIndex(item => item.id === id);

    if(index > -1){
        cart = JSON.parse(localStorage.getItem("cart"));
        const product = cart.find( p => p.id === id);
        
        if(product){
            const newQty = parseInt(product.quantity) + parseInt(qtyChange);
            if(newQty >= 1 && newQty <= product.inStock){
                product.quantity = newQty
                localStorage.setItem("cart", JSON.stringify(cart));
                renderCartSummary();
            }else if(newQty > product.inStock) {
                alert(`Only ${product.inStock} available for ${product.name}`);
            }
            
        }
    }
    
    
}

//render the added products in cart summary
function renderCartSummary() {
    
    const cartList = document.getElementById('cartList');
    const cartTotal = document.getElementById('cartTotal');
    const cartCount = document.getElementById('cartCount');
    

    cartList.innerHTML = '';
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
            <div class="qty-controls">
                <button class="qty-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                    <span class="item-qty">${item.quantity}</span>
                <button class="qty-btn" onclick="updateQuantity(${item.id}, +1)">+</button>
            </div>
            <span class="item-price">$${item.price.toFixed(2)}</span>
            <button class="remove-btn" onclick="removeFromCart(${item.id})"> ❌ </button>
        `;
        //<span class="item-qty">${item.quantity}</span>
        //     <select class="qty-selector" onchange="updateQuantity(${item.id}, this.value)">
        //         ${
        //             quantityCounts.map(qty => 
        //                 `<option value="${qty}" ${qty === parseInt(item.quantity) ? "selected": ""}>${qty}</option>`
        //             )
        //         } 
        //     </select>
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


//handling wishlist 
function handleWishlist(id) {

    const product = products.find( p => p.id === id);
    addUpdateWishlist(product);

    renderWishlist();
    
}

// toggle and add product into wishlist
function addUpdateWishlist(product) {
    const index = wishlist.findIndex(item => item.id === product.id);

    if(index > -1){
        // wishlist = wishlist.filter(item => item.id !== product.id);//update wishlist without selected wishlist id to be removed.
        wishlist.splice(index, 1)//remove one item at index
        if(wishlist.length === 0){
            clearWishlist();
        }
        alert(`${product.name} removed from wishlist.`);
    }else{
        wishlist.push(product); //add product into wishlist
        alert(`${product.name} added to wishlist.`);
    }

    localStorage.setItem("wishlist", JSON.stringify(wishlist));
    toggleWishlist();
}


function renderWishlist(){
    const wishlistList = document.getElementById('wishlistList');
    wishlistList.innerHTML = '';

    if(wishlist.length === 0){
        wishlistList.innerHTML = "<p>Your wishlist is empty.</p>";
        return;
    }

    wishlist.forEach(item => {
        const card = document.createElement('div');

        card.classList = "wishlist-product-card";
        card.innerHTML = `
            <div class="wishlist-product-info">
                <span class="item-name">${item.name}</span>
                <span class="item-category">${item.category}</span>
                <span class="item-price">$${item.price.toFixed(2)}</span>
            </div>
            <div class="wishlist-actions">
                <button class="add-to-cart-btn" onclick="handleAddToCart(${item.id})">Add to cart</button>
                <button class="remove-btn" onclick="removeFromWishlist(${item.id})"> ❌ </button>
            </div>
        `;

        wishlistList.appendChild(card);
    });

    
}

function removeFromWishlist(id) {
    // const index = wishlist.findIndex( item => item.id === id);
    // const wishlistName = wishlist[index].name;

    // if(index > -1){
    //     wishlist.splice(index, 1); //remove one item from index
    //     if(wishlist.length === 0) {
    //         clearWishlist();
    //     }
    //     localStorage.setItem('wishlist', JSON.stringify(wishlist));
    //     alert(`${wishlistName} removed from wishlist.`);
    // }
    wishlist = wishlist.filter(w => w.id !== id);
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
    renderWishlist();
}

function clearWishlist() {
    wishlist = [];
    localStorage.removeItem("wishlist");
    renderWishlist();
}