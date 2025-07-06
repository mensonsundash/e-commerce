import { loadProduct, getFilteredProducts } from "./products.js";
import { loadCart, toggleCart } from "./cart.js";
import { loadWishlist, toggleWishlist } from "./wishlist.js";
import { renderCartSummary } from "./dom.js";
import { renderWishlist } from "./dom.js";
import { loadUser, loadLoggedInUser, loginUser, registerUser } from "./auth.js";

import * as cartModule from './cart.js';
import * as wishlistModule from './wishlist.js';
import * as authModule from './auth.js'
import * as domModule from './dom.js'


/**
 * added to global window with global scope to functions 
 * to call them from HTML as script type ="module" everything is scoped inside the module,
 * and nothing is attached to window unless explicitly do it
 */
window.handleAddToCart = cartModule.handleAddToCart;
window.updateQuantity = cartModule.updateQuantity;
window.removeFromCart = cartModule.removeFromCart;
window.clearCart = cartModule.clearCart;

window.handleWishlist = wishlistModule.handleWishlist;
window.removeFromWishlist = wishlistModule.removeFromWishlist;
window.clearWishlist = wishlistModule.clearWishlist;

window.toggleCart = cartModule.toggleCart;
window.toggleWishlist = wishlistModule.toggleWishlist;

window.openModal = domModule.openModal;
window.closeModal = domModule.closeModal;
window.logoutUser = authModule.logoutUser;

document.addEventListener("DOMContentLoaded", () => {
    loadProduct();
    loadCart();
    loadWishlist();
    loadUser();
    loadLoggedInUser();

    //rendering products list, cart & wishlist summary
    getFilteredProducts();
    renderCartSummary();
    renderWishlist();

    //Event listeners
    const inputTagsClass = [
        "searchInput", 
        "categoryFilter", 
        "minPrice", 
        "maxPrice", 
        "inStockOnly"
    ];

    //Event listeners Loop through all tags id
    inputTagsClass.forEach( id => {
        document.getElementById(id).addEventListener("input", getFilteredProducts);
        document.getElementById(id).addEventListener("change", getFilteredProducts);
    })

    //Form Handlers Event listeners
    document.getElementById("loginForm").addEventListener("submit", loginUser);
    document.getElementById("registerForm").addEventListener("submit", registerUser);

});
