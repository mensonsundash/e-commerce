import { setToStorage, getFromStorage } from "./utils.js";
import { products } from "./products.js";
import { renderWishlist } from "./dom.js";

export let wishlist = []; //Initialize empty wishlist

function loadWishlist(){
    const stored = getFromStorage('wishlist', []);
    wishlist = stored;
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

    setToStorage("wishlist", wishlist)
    // localStorage.setItem("wishlist", JSON.stringify(wishlist));
    toggleWishlist();
}


function removeFromWishlist(id) {
    
    wishlist = wishlist.filter(w => w.id !== id);
    if(wishlist.length === 0) {
            clearWishlist();
    }
    setToStorage("wishlist", wishlist)
    // localStorage.setItem("wishlist", JSON.stringify(wishlist));
    renderWishlist();
}

function clearWishlist() {
    wishlist = [];
    setToStorage("wishlist", wishlist)
    // localStorage.removeItem("wishlist");
    renderWishlist();
}

//toggle wishlist
function toggleWishlist(){
    const wishlistSidebar = document.getElementById('wishlistSidebar');
    wishlistSidebar.classList.toggle('visible');
}


export { loadWishlist, handleWishlist, removeFromWishlist, clearWishlist, toggleWishlist }