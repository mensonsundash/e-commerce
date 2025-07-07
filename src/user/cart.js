import { setToStorage, getFromStorage } from "../common/utils.js";
import { products } from "./products.js";
import { renderCartSummary } from "../common/dom.js";


export let cart = []; //Initialize empty cart array

function loadCart(){
    const stored = getFromStorage('cart', []);
    cart = stored;
}

//handling Add To cart
function handleAddToCart(productId) {
    const product = products.find( p => p.id === productId);
    // if(!loggedInUser){
    //     return alert("Please login to add items.");
    // }
    if(!product || product.inStock <= 0 ){
        alert("Product Unavailable");
        return;
    }
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


    if(getFromStorage('cart')){
        cart = getFromStorage("cart");
        existingItem = cart.findIndex( item => item.id === product.id);
    }
    
    if(existingItem > -1) {
        cart[existingItem].quantity += 1;
    }else {
        cart.push({ ...product, quantity: 1 });
    }

    removeFromWishlist(product.id)

    setToStorage("cart", cart)
    alert(`${product.name} added to cart`);
    toggleCart();
}



//update cart while +/- of the quantity
function updateQuantity(id, qtyChange) {
    const index = cart.findIndex(item => item.id === id);

    if(index > -1){
        cart = getFromStorage("cart")
        const product = cart.find( p => p.id === id);
        
        if(product){
            const newQty = parseInt(product.quantity) + parseInt(qtyChange);
            if(newQty >= 1 && newQty <= product.inStock){
                product.quantity = newQty
                setToStorage("cart", cart);
                renderCartSummary();
            }else if(newQty > product.inStock) {
                alert(`Only ${product.inStock} available for ${product.name}`);
            }
            
        }
    }
    
    
}

//remove product from cart
function removeFromCart(id) {
    // filter product from cart that is not with remove item id
    cart = cart.filter(item => item.id !== id);
    //update localStorage Cart item without remove id
    setToStorage("cart", cart);
    renderCartSummary();
}

//clear cart 
function clearCart() {
    // clear the cart array statement
    cart = [];
    setToStorage("cart", cart);
    // localStorage.removeItem("cart");
    renderCartSummary();
}

//toggle cartsidebar
function toggleCart(){
    const cartsidebar = document.getElementById('cartSidebar');
    cartsidebar.classList.toggle('visible');
}


export { loadCart, handleAddToCart, updateQuantity, removeFromCart, clearCart, toggleCart }
