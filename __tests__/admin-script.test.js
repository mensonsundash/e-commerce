import { jest }from "@jest/globals";
import { searchByKeywords, renderProducts, addProduct, updateProduct, deleteProduct, products  } from "../admin-script.js";

//grouping searchByKeywords test
describe("searchByKeywords", () => {

    const mockProducts = [
        { id: 1, name: 'Shirt', category: 'clothing' },
        { id: 2, name: 'TV', category: 'electronics' },
        { id: 3, name: 'Jeans', category: 'clothing' }
    ];

    test('search products by keywords', () => {
        const result = searchByKeywords(mockProducts, "clothing");
        //assertion
        expect(result).toEqual([
            { id: 1, name: 'Shirt', category: 'clothing' },
            { id: 3, name: 'Jeans', category: 'clothing' }
        ]);
    });

    test('returns all products if no keywords is given', () => {
        const result = searchByKeywords(mockProducts, "");
        //assertion
        expect(result).toEqual(mockProducts);
    });
});

//grouping renderProducts test
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
        //assertions
        expect(rows.length).toBe(1);//check if exactly 1 <tr> table row was added to the table.
        expect(rows[0].innerHTML).toContain("Shirt");
        expect(rows[0].innerHTML).toContain("Clothing");
        expect(rows[0].innerHTML).toContain("$25.50");
    });

    test('shows no products found if array is empty', () => {
        renderProducts([]);
        const tableBody = document.getElementById("productTable");
        //assertion
        expect(tableBody.innerHTML).toBe("No Products found.");
    });
});

//grouping addProduct test
describe("addProduct", ()  => {

    let form;

    beforeEach( () => {
        //reset product and localStorage
        products.length = 0;
        localStorage.clear();

        //set up mocked DOM element as a fake HTML structure so the function has a DOM to interact with.
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

        //create a fake event with preventDefault
        form = document.getElementById("productForm");
    });
    
    test('adds a new product to products array and localStorage', () => {
        const event = { preventDefault: jest.fn() }; //Event mocked
        
        addProduct(event)

        //assertions
        expect(products.length).toBe(1);
        expect(products[0].name).toBe("Shirt");

        const stored = JSON.parse(localStorage.getItem("products"));
        expect(stored[0].category).toBe("Clothing");
    });

    test("prevents duplicate product addition", () => {
        const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => {}); //Browser APIs mocked

        const event = { preventDefault: jest.fn() }; //Event mocked
        addProduct(event); //first product add
        addProduct(event); //second product attempt (same product))

        //assertions
        expect(alertMock).toHaveBeenCalled();

        expect(products.length).toBe(1); //still only 1 product
        alertMock.mockRestore();
    });

    test("prevents adding if required fields are missing", () => {
        document.getElementById("productName").value ="";
        const event = { preventDefault: jest.fn() }; //Event mocked

        const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => {}); //Browser APIs mocked
        addProduct(event);

        //assertions
        expect(alertMock).toHaveBeenCalledWith("All fields are required.");
        expect(products.length).toBe(0);

        alertMock.mockRestore();
    });


});

//grouping updateProduct test
describe('updateProduct', () => {
    
    beforeEach( () => {
        products.length = 0;
        localStorage.clear();

        //Mock existing product and editingId
        products.push({
            id: 123,
            name: "Old Shirt",
            category: "Old Clothing",
            price: 20,
            inStock: 10
        });

        
        //since editingId was exported as let, set editingId
        Object.assign(global, { editingId: 123 });

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
                <input id="productName" value="New Shirt" />
                <input id="productCategory" value="New Clothing" />
                <input id="productPrice" value="45.5" />
                <input id="productStock" value="25" />
            </form>
        </div>
        `;
        
    });
    
    test('updates product and saves to localStorage', () => {
        const event = { preventDefault: jest.fn() }; //Event mocked
        
        updateProduct(event, editingId);

        //assertions
        expect(products[0].name).toBe("New Shirt");
        expect(products[0].category).toBe("New Clothing");

        const stored = JSON.parse(localStorage.getItem("products"));
        expect(stored[0].price).toBe(45.5);
    });

    test("prevent duplicate product update", () => {
        //Add into products array as a second product to conflict with
        products.push({
            id: 999,
            name: "Duplicate",
            category: "New Clothing",
            price: 99,
            inStock: 20
        });

        //getting as from form with same details
        document.getElementById("productName").value = "Duplicate";
        document.getElementById("productCategory").value = "New Clothing";

        const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => {}); //Browser APIs mocked
        const event = { preventDefault: jest.fn() }; //Event mocked

        updateProduct(event, editingId);
        
        //assertions
        expect(alertMock).toHaveBeenCalled();
        expect(products[0].name).toBe("Old Shirt"); //didn't update
        expect(products[1].name).toBe("Duplicate"); //didn't update

        alertMock.mockRestore();
    });

    test("prevent update when required fields are missing", () => {
        document.getElementById("productName").value = "";

        const alertMock = jest.spyOn(window, 'alert').mockImplementation( () => {} ); //Browser APIs mocked
        const event = { preventDefault: jest.fn() }; //Event mocked

        updateProduct(event, editingId);

        //assertions
        expect(alertMock).toHaveBeenCalledWith("All field are required.");
        expect(products[0].name).toBe("Old Shirt");

        alertMock.mockRestore();
    });

});

//grouping deleteProduct test
describe("deleteProduct", () => {
    beforeEach(() => {
        products.length = 0;
        localStorage.clear();

        products.push({
            id: 123,
            name: "Shirt",
            category: "Clothing",
            price: 25,
            inStock: 10
        });
        //as after delete has product list section included `listProduct() so all DOM is included`
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
        </div>`;
    });

    test("deletes product when confirmed", () => {
        const confirmMock = jest.spyOn(window, 'confirm').mockReturnValue(true); //Browser APIs mocked
        jest.useFakeTimers();

        deleteProduct(123);

        jest.runAllTimers(); //fast-forward timers

        //assertions
        expect(products.length).toBe(0);

        const stored = JSON.parse(localStorage.getItem("products"));
        expect(stored).toEqual([]); //No product

        confirmMock.mockRestore();
        jest.useRealTimers();
    });

    test("does not delete product when cancelled", () => {
        const confirmMock = jest.spyOn(window, 'confirm').mockReturnValue(false); //Browser APIs mocked
          
        jest.useFakeTimers();

        deleteProduct(123);

        jest.runAllTimers();

        //assertion
        expect(products.length).toBe(1); //product still there

        confirmMock.mockRestore();
        jest.useRealTimers();
    });
});