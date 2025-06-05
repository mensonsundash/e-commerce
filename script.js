const products = [
    {
        id: 1,
        name: "Wireless Mouse",
        category: "electronics",
        price: 29.99,
        inStock: true
    },
    {
        id: 2,
        name: "T-Shirt",
        category: "clothing",
        price: 19.99,
        inStock: false
    },
    {
        id: 3,
        name: "32\" Monitor",
        category: "electronics",
        price: 640,
        inStock: true
    },
    {
        id: 4,
        name: "Camping Chair",
        category: "outdoor",
        price: 54,
        inStock: true
    }
];

function filterByCategory(products, category, partial = false) {
    const categoryLower = category.toLowerCase();

    if(!Array.isArray(products)|| !category)  return [];

    return products.filter(product => {
        const productCategoryLower = product.category.toLowerCase();
        return partial ? productCategoryLower.includes(categoryLower) : productCategoryLower === categoryLower;
    })
}

// console.log(filterByCategory(products, "clothing")); // [T-Shirt]
// console.log(filterByCategory(products, "Elect", true)); // [Wireless Mouse] (if you had one)

function filterByPriceRange(products, min, max) {

    if(!Array.isArray(products) || typeof min !== 'number' || typeof max !== 'number') return [];
    if(min > max) [min, max] = [max, min];

    return products.filter(product => product.price >= min && product.price <= max);
}

console.log(filterByPriceRange(products, 10, 50)); // [Shirt]
console.log(filterByPriceRange(products, 60, 5));  // [Shirt, Pen] (if swapped)