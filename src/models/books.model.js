const pool = require("../config/database.config");
const { paginate } = require("../utils/pagination.util");


async function create(bookInfo) {
    const { title, author, publication_year } = bookInfo;

    const query = `
    INSERT INTO books (title, author, publication_year) 
    VALUES (?, ?, ?)`;

    try {
        const [results] = await pool.execute(query, [title, author, publication_year]);
        return results;
    } catch (error) {
        throw error;
    }
}

async function getAll(page = 1, limit = 10, filters = {}) {
    const { q } = filters;
    let queryParams = [];
    let whereClause = [];

    if (q && typeof q === "string") {
        whereClause.push("(title LIKE ? OR author LIKE ?)");
        queryParams.push(`%${q}%`, `%${q}%`);
    }

    const whereQuery = whereClause.length > 0 ? " WHERE " + whereClause.join(" AND ") : "";

    const selectQuery = `
      SELECT id, title, author, publication_year, created_at, updated_at
      FROM books
      ${whereQuery}
      ORDER BY id DESC
    `;

    const countQuery = `
      SELECT COUNT(*) AS total
      FROM books
      ${whereQuery}
    `;

    const offset = (parseInt(page, 10) - 1) * parseInt(limit, 10);

    try {
        const result = await paginate(selectQuery, countQuery, parseInt(page, 10), parseInt(limit, 10), offset, queryParams);
        return result;
    } catch (error) {
        console.error("Error fetching books:", error);
        throw error;
    }
}





async function getById(bookId) {
    const query = `
      SELECT id, title, author, publication_year, created_at, updated_at
      FROM books 
      WHERE id = ?
    `;

    try {
        const [rows] = await pool.execute(query, [bookId]);
        return rows[0];
    } catch (error) {
        throw error;
    }
}

async function update(bookId, bookInfo) {
    const { title, author, publication_year } = bookInfo;
    const queryParams = [];
    const updateFields = [];

    if (title) {
        updateFields.push("title = ?");
        queryParams.push(title);
    }
    if (author) {
        updateFields.push("author = ?");
        queryParams.push(author);
    }
    if (publication_year) {
        updateFields.push("publication_year = ?");
        queryParams.push(publication_year);
    }

    if (updateFields.length === 0) {
        throw new Error("No fields provided for update.");
    }

    updateFields.push("updated_at = NOW()");

    queryParams.push(bookId);

    const query = `
      UPDATE books
      SET ${updateFields.join(", ")}
      WHERE id = ?
    `;

    try {
        console.log("Executing Query:", query);
        console.log("Query Params:", queryParams);

        const [results] = await pool.execute(query, queryParams);
        return results;
    } catch (error) {
        console.error("Error updating book:", error);
        throw error;
    }
}


async function remove(bookId) {
    const query = `DELETE FROM books WHERE id = ?`;

    try {
        const [results] = await pool.execute(query, [bookId]);
        return results;
    } catch (error) {
        throw error;
    }
}

module.exports = { create, getAll, getById, update, remove };
