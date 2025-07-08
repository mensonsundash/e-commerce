import { productsArr } from "../data/sample-product.js";
import { getFromStorage, setToStorage } from "../common/utils.js";
import { openModal, closeModal, resetForm } from "../common/dom.js";
import { renderProducts, listProduct } from "../common/admin-dom.js";

export let products = [];
export let editingId = null;

function loadProduct() {
    const stored = getFromStorage("products", []);
    if(!stored.length){
        setToStorage("products", productsArr);
        products = [...productsArr];
    }else{
        products = stored;
    }
}

function getFilteredProducts() {
    let filtered = [...products];//spread operator to make separate from original variable `products`

    const search = document.getElementById("searchInput").value;

    if(search) filtered = searchByKeywords(filtered, search);

    renderProducts(filtered);
}

function searchByKeywords(list, keywords){
    const keywordsLower = keywords.toLowerCase();
    if(!Array.isArray(list) || !keywords) return list;

    return list.filter( p => {
        const productName = p.name.toLowerCase();;
        const category = p.category.toLowerCase();

        return productName.includes(keywordsLower) || category.includes(keywordsLower);
    });

}

function addProductModal(){
    const productHeader = document.getElementById("productHeader");
    const productSubmit = document.getElementById("productSubmit");
    productHeader.textContent = "Add Product";
    productSubmit.textContent = "Add";

    editingId = null;
    resetForm("productForm");
    
    openModal("productModal");
    
    document.getElementById("productForm").addEventListener("submit", addProduct);
}

function addProduct(e){
    e.preventDefault();

    const name = document.getElementById("productName").value.trim();
    const category = document.getElementById("productCategory").value.trim();
    const price = parseFloat(document.getElementById("productPrice").value || 0);
    const inStock = parseInt(document.getElementById("productStock").value || 0);

    if(!name || !category || !price || !inStock){
        alert("All fields are required.");
        return;
    }

    //restricting duplicate product
    const existinProduct = products.find(p => p.name.toLowerCase() === name.toLowerCase() && p.category.toLowerCase() === category.toLowerCase());
    if(existinProduct){
        alert(`"${existinProduct.name}" already Exist with "${existinProduct.category}" category.`);
        return;
    }
    
    const newProduct = {
        id: Date.now(),
        name,
        category,
        price,
        inStock
    };

    products.push(newProduct);

    // localStorage.setItem("products", JSON.stringify(products));
    setToStorage("products", products);
    closeModal("productModal");
    listProduct();

}

function editProduct(productId) {
    openModal("productModal");
    editingId = productId;
    const productHeader = document.getElementById("productHeader");
    const productSubmit = document.getElementById("productSubmit");
    productHeader.textContent = "Update Product";
    productSubmit.textContent = "Update";

    const product = products.find(p => p.id === productId)
    document.getElementById("productName").value = product.name;
    document.getElementById("productCategory").value = product.category;
    document.getElementById("productPrice").value = product.price;
    document.getElementById("productStock").value = product.inStock;

    // calling event listenere for submit to call update function
    document.getElementById("productForm").addEventListener("submit", (e) => updateProduct(e, editingId));
    
}
function updateProduct(e, editId = null){
    e.preventDefault();

    const editCheckId = editId ?? editingId; //if editId is null fallback to global editingId value
    const indexing = products.findIndex(p => p.id === editCheckId);
    if(indexing !== -1){
        const name = document.getElementById("productName").value.trim();
        const category = document.getElementById("productCategory").value.trim();
        const price = parseFloat(document.getElementById("productPrice").value.trim());
        const inStock = parseInt(document.getElementById("productStock").value.trim());

        if(!name || !category || !price || !inStock){
            alert("All field are required.");
            return;
        }
        
        //restricting duplicate product
        const existinProduct = products.find(p => p.id !== editCheckId && p.name.toLowerCase() === name.toLowerCase() && p.category.toLowerCase() === category.toLowerCase());
        if(existinProduct){
            alert(`"${existinProduct.name}" already Exist with "${existinProduct.category}" category.`);
            return;
        }

        products[indexing] = {
            id: editCheckId,
            name,
            category,
            price,
            inStock
        };

        // localStorage.setItem("products", JSON.stringify(products));
        setToStorage("products", products)
        closeModal("productModal");
        listProduct();
    }
    

}

function deleteProduct(id) {
    const index = products.findIndex(p => p.id === id);
    const producFind = products.find(p => p.id === id);
    const timeout = 500;// 500 ms = 5 s
    if(confirm(`Are you sure? you want to delete "${producFind.name}".`)) {
        
        setTimeout(() => {
            if(index !== -1){
                products.splice(index, 1)
                // localStorage.setItem("products", JSON.stringify(products));
                setToStorage("products", products)
                listProduct();
            }
        }, timeout);

        
    }

}


export { loadProduct, searchByKeywords, getFilteredProducts, addProductModal, addProduct, editProduct, updateProduct, deleteProduct }
