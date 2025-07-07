import { productsArr } from "../data/sample-product.js";
import { getFromStorage, setToStorage } from "../common/utils.js";
import { displayProducts } from "../common/dom.js";

//Variable Declaration 
export let products = [];//Initialize empty products array


function loadProduct(){
    const stored = getFromStorage('products', []);
    if(!stored.length) {
        setToStorage('products', productsArr);
        products = [...productsArr];
    }else{
        products = stored;
    }
}

//filter bycategory
function filterByCategory(list, category) {
    
    if(!Array.isArray(list)|| !category)  return [];
    
    const categoryLower = category.toLowerCase();

    return list.filter(p => p.category.toLowerCase().includes(categoryLower));
}

//filter by price range
function filterByPriceRange(list, min, max) {

    if(!Array.isArray(list) || typeof min !== 'number' || typeof max !== 'number') return [];
    if(min > max) [min, max] = [max, min];

    return list.filter(p => p.price >= min && p.price <= max);
}

//searching products
function searchByKeyword(list, keywords) {
    const keywordLower = keywords.toLowerCase();

    if(!Array.isArray(list) || !keywords) return list;

    return list.filter(p =>  p.name.toLowerCase().includes(keywordLower) || p.category.toLowerCase().includes(keywordLower));
}

//stock availability check
function getAvailableProducts(list) {
    return list.filter(p => p.inStock > 0);
}

/**
 * RESULTING FUNCTIONS
 */
//filtered product combined
function getFilteredProducts() {
    const search = document.getElementById('searchInput').value;
    const category = document.getElementById('categoryFilter').value;
    const minPrice = parseFloat(document.getElementById('minPrice').value) || 0;
    const maxPrice = parseFloat(document.getElementById('maxPrice').value);
    const inStockOnly = document.getElementById('inStockOnly').checked;

    let result = [...products];

    if(search) result = searchByKeyword(result, search);
    if(category) result = filterByCategory(result, category);
    if(minPrice || maxPrice) result = filterByPriceRange(result, minPrice, maxPrice);
    if(inStockOnly) result = getAvailableProducts(result);
    
    displayProducts(result);
}

export { loadProduct, filterByCategory, filterByPriceRange, searchByKeyword, getAvailableProducts, getFilteredProducts };