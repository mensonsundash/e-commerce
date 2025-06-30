import { searchByKeywords } from "../admin-script.js";

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
