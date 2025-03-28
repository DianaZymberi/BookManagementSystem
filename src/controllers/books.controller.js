const bookModel = require("../models/books.model");

const getBooks = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    try {
        const books = await bookModel.getAll(page, limit, req.query);
        if (books.length === 0) {
            return res.status(200).json({ message: "No books were found!" });
        }
        return res.status(200).json(books);
    } catch (error) {
        console.error("Error retrieving books:", error);
        return res.status(500).json({ message: "Error retrieving books!" });
    }
};

const getBook = async (req, res) => {
    try {
        const { id, role } = req.user;
        const bookId = req.params.id;
        const book = await bookModel.getById(bookId);

        if (!book) {
            return res.status(404).json({ message: "Book not found!" });
        }
        return res.status(200).json(book);
    } catch (error) {
        console.error("Error retrieving book:", error);
        return res.status(500).json({ message: "Error retrieving book!" });
    }
};

const createBook = async (req, res) => {
    try {
        const { title, author, publication_year } = req.body;

        if (!title || !author || !publication_year) {
            return res.status(400).json({ message: "All fields are required!" });
        }

        const result = await bookModel.create(req.body);
        if (!result.insertId) {
            return res.status(400).json({ message: "Failed to add book!" });
        }
        return res.status(201).json({ message: "Book added successfully!" });
    } catch (error) {
        console.error("Error adding book:", error);
        return res.status(500).json({ message: "Error adding book!" });
    }
};

const updateBook = async (req, res) => {
    try {
        const bookId = req.params.id;
        const book = await bookModel.getById(bookId);

        if (!book) {
            return res.status(404).json({ message: "Book not found!" });
        }

        const result = await bookModel.update(bookId, req.body);
        if (result.affectedRows === 0) {
            return res.status(400).json({ message: "Failed to update book!" });
        }
        return res.status(200).json({ message: "Book updated successfully!" });
    } catch (error) {
        console.error("Error updating book:", error);
        return res.status(500).json({ message: "Error updating book!" });
    }
};

const deleteBook = async (req, res) => {
    try {
        const bookId = req.params.id;
        const book = await bookModel.getById(bookId);

        if (!book) {
            return res.status(404).json({ message: "Book not found!" });
        }

        const result = await bookModel.remove(bookId);
        if (result.affectedRows === 0) {
            return res.status(400).json({ message: "Failed to delete book!" });
        }
        return res.status(200).json({ message: "Book deleted successfully!" });
    } catch (error) {
        console.error("Error deleting book:", error);
        return res.status(500).json({ message: "Error deleting book!" });
    }
};

module.exports = { getBooks, getBook, createBook, updateBook, deleteBook };
