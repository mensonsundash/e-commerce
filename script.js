// Sample product data
const products = [
  { id: 1, name: "Wireless Mouse", category: "electronics", price: 29.99, inStock: true },
  { id: 2, name: "T-Shirt", category: "clothing", price: 19.99, inStock: false },
  { id: 3, name: "Bluetooth Headphones", category: "electronics", price: 49.99, inStock: true },
  { id: 4, name: "Jeans", category: "clothing", price: 39.99, inStock: true }
];

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

