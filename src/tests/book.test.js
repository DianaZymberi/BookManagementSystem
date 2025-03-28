require('iconv-lite').encodingExists('foo');
const request = require("supertest");
const app = require("../../server");
const bookModel = require("../models/books.model");
const { faker } = require("@faker-js/faker");
const pool = require("../config/database.config");

jest.mock("../models/books.model");

describe("Books API", () => {
    const generateBook = () => ({
        id: faker.number.int({ min: 1, max: 1000 }), 
        title: faker.lorem.words(3),
        author: faker.name.fullName(),
        publication_year: faker.date.past(10).getFullYear(),
        created_at: faker.date.past(),
        updated_at: faker.date.recent(),
    });

    afterEach(() => {
        jest.clearAllMocks(); 
    });

    
    it("should return a list of books", async () => {
        const mockBooks = Array.from(generateBook);
        bookModel.getAll.mockResolvedValue(mockBooks);

        const res = await request(app).get("/api/books/getBooks").query({ page: 1, limit: 5 });

        expect(res.status).toBe(200);
        expect(res.body).toEqual(mockBooks);
    });


    it("should return a single book", async () => {
        const mockBook = generateBook();
        bookModel.getById.mockResolvedValue(mockBook);

        const res = await request(app).get(`/api/books/getBook/${mockBook.id}`);

        expect(res.status).toBe(200);
        expect(res.body).toEqual(mockBook);
    });

    it("should return 404 if the book is not found", async () => {
        bookModel.getById.mockResolvedValue(null);

        const res = await request(app).get("/api/books/getBook/9999");

        expect(res.status).toBe(404);
        expect(res.body.message).toBe("Book not found!");
    });

    
    it("should create a new book", async () => {
        const newBook = {
            title: faker.lorem.words(3),
            author: faker.name.fullName(),
            publication_year: faker.date.past(10).getFullYear(),
        };

        bookModel.create.mockResolvedValue({ insertId: faker.number.int({ min: 100, max: 999 }) });

        const res = await request(app).post("/api/books/createBook").send(newBook);

        expect(res.status).toBe(201);
        expect(res.body.message).toBe("Book added successfully!");
    });

    it("should return 400 when missing fields while creating a book", async () => {
        const res = await request(app).post("/api/books/createBook").send({ title: "Incomplete Book" });

        expect(res.status).toBe(400);
        expect(res.body.message).toBe("All fields are required!");
    });

    
    it("should update an existing book", async () => {
        const mockBook = generateBook();
        bookModel.getById.mockResolvedValue(mockBook);
        bookModel.update.mockResolvedValue({ affectedRows: 1 });

        const updatedBook = { title: faker.lorem.words(2) };

        const res = await request(app).put(`/api/books/updateBook/${mockBook.id}`).send(updatedBook);

        expect(res.status).toBe(200);
        expect(res.body.message).toBe("Book updated successfully!");
    });

    it("should return 404 if updating a non-existent book", async () => {
        bookModel.getById.mockResolvedValue(null);

        const res = await request(app).put("/api/books/updateBook/9999").send({ title: "Updated Title" });

        expect(res.status).toBe(404);
        expect(res.body.message).toBe("Book not found!");
    });

    
    it("should delete a book", async () => {
        const mockBook = generateBook();
        bookModel.getById.mockResolvedValue(mockBook);
        bookModel.remove.mockResolvedValue({ affectedRows: 1 });

        const res = await request(app).delete(`/api/books/deleteBook/${mockBook.id}`);

        expect(res.status).toBe(200);
        expect(res.body.message).toBe("Book deleted successfully!");
    });

    it("should return 404 if deleting a non-existent book", async () => {
        bookModel.getById.mockResolvedValue(null);

        const res = await request(app).delete("/api/books/deleteBook/9999");

        expect(res.status).toBe(404);
        expect(res.body.message).toBe("Book not found!");
    });
});

test('database connection is successful', async () => {
    try {
        const connection = await pool.getConnection(); 
        expect(connection).toBeTruthy(); 
        connection.release(); 
    } catch (error) {
        console.error("Connection failed:", error);
        throw error; 
    }
});
