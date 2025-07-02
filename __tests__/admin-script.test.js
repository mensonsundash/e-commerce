import { jest }from "@jest/globals";
import { searchByKeywords, renderProducts, addProduct, updateProduct, deleteProduct, products  } from "../admin-script.js";

describe("searchByKeywords", () => {
    const mockProducts = [
        { id: 1, name: 'Shirt', category: 'clothing' },
        { id: 2, name: 'TV', category: 'electronics' },
        { id: 3, name: 'Jeans', category: 'clothing' }
    ];

    test('search products by keywords', () => {
        const result = searchByKeywords(mockProducts, "clothing");
        expect(result).toEqual([
            { id: 1, name: 'Shirt', category: 'clothing' },
            { id: 3, name: 'Jeans', category: 'clothing' }
        ]);
    });

    test('returns all products if no keywords is given', () => {
        const result = searchByKeywords(mockProducts, "");
        expect(result).toEqual(mockProducts);
    });
});

describe("renderProducts",  () =>  {
    beforeEach( ()=> {
        document.body.innerHTML = `
        <table>
        <tbody id="productTable"></tbody>
        </table>`;
    });

    test('renders product rows to table', () => {
        const mockProducts = [
            { id: 1, name: "Shirt", category: "Clothing", price: 25.5, inStock: 10}
        ];

        renderProducts(mockProducts);

        const rows = document.querySelectorAll("#productTable tr");
        expect(rows.length).toBe(1);//check if exactly 1 <tr> table row was added to the table.
        expect(rows[0].innerHTML).toContain("Shirt");
        expect(rows[0].innerHTML).toContain("Clothing");
        expect(rows[0].innerHTML).toContain("$25.50");
    });

    test('shows no products found if array is empty', () => {
        renderProducts([]);
        const tableBody = document.getElementById("productTable");
        expect(tableBody.innerHTML).toBe("No Products found.");
    });
});


describe("addProduct", ()  => {

    let form;

    beforeEach( () => {
        //reset product and localStorage
        products.length = 0;
        localStorage.clear();

        //set up DOM element as a fake HTML structure so the function has a DOM to interact with.
        document.body.innerHTML = `
        <div id="productListSection" class="content-section">
            <h2>Product List</h2>
            <div class="top-header">
                <input type="text" id="searchInput" class="search-input" placeholder="Search products by name or category ..." />
                <button onclick="addProductModal()" class="addProduct-btn"><span>➕</span> <span>Add</span></button>
            </div>
            <table class="product-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Category</th>
                        <th>Price</th>
                        <th>Stock</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody id="productTable"></tbody>
            </table>
        </div>
        

        <div id="productModal" class="modal-overlay hidden">
            <form id="productForm">
                <input id="productName" value="Shirt" />
                <input id="productCategory" value="Clothing" />
                <input id="productPrice" value="29.99" />
                <input id="productStock" value="5" />
            </form>
        </div>
        `;

        //create a fake eventt with preventDefault
        form = document.getElementById("productForm");
    });
    
    test('adds a new product to products array and localStorage', () => {
        const event = { preventDefault: jest.fn() };
        
        addProduct(event)

        expect(products.length).toBe(1);
        expect(products[0].name).toBe("Shirt");

        const stored = JSON.parse(localStorage.getItem("products"));
        expect(stored[0].category).toBe("Clothing");
    });

    test("prevents duplicate product addition", () => {
        const event = { preventDefault: jest.fn() };
        addProduct(event); //first product add
        addProduct(event); //second product attempt (same product))

        expect(products.length).toBe(1); //still only 1 product
    });

    test("prevents adding if required fields are missing", () => {
        document.getElementById("productName").value ="";
        const event = { preventDefault: jest.fn() };

        const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => {});
        addProduct(event);

        expect(alertMock).toHaveBeenCalledWith("All fields are required.");
        expect(products.length).toBe(0);

        alertMock.mockRestore();
    });


});