import { cart, handleAddToCart, updateQuantity, removeFromCart, clearCart } from "../user/cart.js";
import { wishlist, handleWishlist, removeFromWishlist, clearWishlist } from "../user/wishlist.js";

//display products UI Rendered
function displayProducts(list) {
    const container = document.getElementById('productList');

    container.innerHTML = '';

    if(!list.length) {
        container.innerHTML = '<p> No Product Found.</p>';
        return;
    }

    list.forEach(product => {
        const div = document.createElement('div');
        div.className = 'product-card';
        div.innerHTML = `
            <h3>${product.name}</h3>
            <p>Category: ${product.category}</p>
            <p>Price: ${product.price.toFixed(2)}</P>
            <p>${product.inStock > 0 ? "✅ In Stock" : "❌ Out of Stock"}</p>
            <button class="add-to-cart-btn" onclick="handleAddToCart(${product.id})">Add to cart</button>
            <button class="wishlist-btn" onclick="handleWishlist(${product.id})">❤️ Wishlist</button>
        `;// <button class="add-to-cart-btn" data-id="${product.id}">Add to cart</button>
        container.appendChild(div);
    });

}


//render the added products in cart summary
function renderCartSummary() {
    
    const container = document.getElementById('cartList');
    const cartTotal = document.getElementById('cartTotal');
    const cartCount = document.getElementById('cartCount');
    

    container.innerHTML = '';
    if(cart.length === 0) {
        container.innerHTML = "<p>Cart is empty.</p>";
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
        container.appendChild(div);
    });
    
    cartCount.textContent =  cart.length;
    cartTotal.textContent = `Total: $${total.toFixed(2)}`;
}

//rendering wishlist
function renderWishlist(){
    const container = document.getElementById('wishlistList');
    const wishCounteer = document.getElementById("wishCount");
    wishCounteer.textContent = wishlist.length;

    container.innerHTML = '';

    if(wishlist.length === 0){
        container.innerHTML = "<p>Your wishlist is empty.</p>";
        return;
    }

    wishlist.forEach(item => {
        const div = document.createElement('div');

        div.classList = "wishlist-product-card";
        div.innerHTML = `
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

        container.appendChild(div);
    });

    
}


// ACCOUNT MODAL

function openModal(modalId) {
    document.getElementById(modalId).classList.remove("hidden");
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.add("hidden");
}

function resetForm(formId){
    document.getElementById(formId).reset();
}

export { displayProducts, renderCartSummary, renderWishlist, openModal, closeModal, resetForm }