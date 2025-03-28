const express = require("express");
const router = express.Router();
const bookController = require("../controllers/books.controller");
const { authMiddleware, isPriviledged } = require("../middleware/auth.middleware");

/**
 * @swagger
 * /api/books/getBooks:
 *   get:
 *     summary: Get all books
 *     tags: [Books]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of books per page
 *     responses:
 *       200:
 *         description: List of books
 */
router.get("/getBooks", authMiddleware, bookController.getBooks);

/**
 * @swagger
 * /api/books/getBook/{id}:
 *   get:
 *     summary: Get a single book
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Book ID
 *     responses:
 *       200:
 *         description: Book details
 *       404:
 *         description: Book not found
 */
router.get("/getBook/:id",authMiddleware, bookController.getBook);

/**
 * @swagger
 * /api/books/createBook:
 *   post:
 *     summary: Add a new book
 *     tags: [Books]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               author:
 *                 type: string
 *               publication_year:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Book added successfully
 */
router.post("/createBook",authMiddleware, bookController.createBook);

/**
 * @swagger
 * /api/books/updateBook/{id}:
 *   put:
 *     summary: Update a book
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Book ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               author:
 *                 type: string
 *               publication_year:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Book updated successfully
 *       404:
 *         description: Book not found
 */
router.put("/updateBook/:id", authMiddleware, bookController.updateBook);

/**
 * @swagger
 * /api/books/deleteBook/{id}:
 *   delete:
 *     summary: Delete a book
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Book ID
 *     responses:
 *       200:
 *         description: Book deleted successfully
 *       404:
 *         description: Book not found
 */
router.delete("/deleteBook/:id", authMiddleware, bookController.deleteBook);

module.exports = router;
