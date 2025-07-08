import { dashboard, listProduct, toggleProfile } from "../common/admin-dom.js";
import { loadLoggedInUser, loggedInUser, logoutAdmin } from "../common/auth.js";
import { redirectToHome } from '../common/utils.js';
import * as domModule from "../common/dom.js";
import * as productModule from './products.js';


/**
 * added to global window with global scope to functions 
 * to call them from HTML as script type ="module" everything is scoped inside the module,
 * and nothing is attached to window unless explicitly do it
 */
window.toggleProfile = toggleProfile;
window.dashboard = dashboard;
window.listProduct = listProduct;

window.closeModal = domModule.closeModal;
window.logoutAdmin = logoutAdmin;

window.addProductModal = productModule.addProductModal;
window.editProduct = productModule.editProduct;
window.deleteProduct = productModule.deleteProduct;

document.addEventListener("DOMContentLoaded", () => {
    loadLoggedInUser();
    productModule.loadProduct();
    

    if(!loggedInUser || loggedInUser.role !== "admin"){
        alert('Access denied. Only admins allowed.')
        redirectToHome();//redirect to main front page
        
    } else {
        dashboard(); //admin dashboard after login successful

    }
    
});

