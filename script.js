// Sample product data
const products = [
  { id: 1, name: "Wireless Mouse", category: "electronics", price: 29.99, inStock: true },
  { id: 2, name: "T-Shirt", category: "clothing", price: 19.99, inStock: false },
  { id: 3, name: "Bluetooth Headphones", category: "electronics", price: 49.99, inStock: true },
  { id: 4, name: "Jeans", category: "clothing", price: 39.99, inStock: true }
];


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

//function to display products UI Rendered
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
            <button class="add-to-cart-btn" data-id="${product.id}">Add to cart</button>
        `;
        container.appendChild(card);
    });

}


//Event listeners
["searchInput", "categoryFilter", "minPrice", "maxPrice", "inStockOnly"].forEach( id => {
    document.getElementById(id).addEventListener("input", getFilteredProducts);
    document.getElementById(id).addEventListener("change", getFilteredProducts);
})

// document.getElementById('searchInput').addEventListener("input", getFilteredProducts);
// document.getElementById('categoryFilter').addEventListener("change", getFilteredProducts);
// document.getElementById('minPrice').addEventListener("input", getFilteredProducts);
// document.getElementById('maxPrice').addEventListener("input", getFilteredProducts);
// document.getElementById('inStockOnly').addEventListener("input", getFilteredProducts)

// Initial display
getFilteredProducts();