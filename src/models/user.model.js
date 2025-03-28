const pool = require("../config/database.config");
const bcrypt = require("bcrypt");
const { paginate } = require("../utils/pagination.util");

async function create(user_info) {
    const { name, email, password, role } = user_info;
    const hashed_password = bcrypt.hashSync(password, 10);

    const query = `
    INSERT INTO users 
    (name, email, password, role)
    VALUES (?,?,?,?)`;

    try {
        const [results] = await pool.execute(query, [
            name,
            email,
            hashed_password, 
            role || "user", 
        ]);

        return results;
    } catch (error) {
        throw error;
    }
}

async function getAll(page, limit, filters) {
    const { q } = filters;
    const queryParams = [];
    const whereClause = [];
  
    if (q) {
      whereClause.push("(u.name LIKE ? OR email LIKE ? OR phone_number LIKE ?)");
      queryParams.push(`%${q}%`, `%${q}%`, `%${q}%`);
    }
  
    const whereQuery = whereClause.length > 0 ? " WHERE " + whereClause.join(" AND ") : "";
  
    let selectQuery = `
      SELECT 
        u.id,
        u.name,
        email,
        role,
        u.created_at, 
        u.updated_at
      FROM users AS u
      ${whereQuery}
      ORDER BY u.id DESC
    `;
  
    const countQuery = `
      SELECT COUNT(*) AS total
      FROM users AS u
      ${whereQuery}
    `;
  
    try {
      const offset = (page - 1) * limit;
      queryParams.push(limit, offset);
  
      // Pass the correct parameters to paginate
      const rows = await paginate(selectQuery, countQuery, page, limit, offset, queryParams);
      return rows;
    } catch (error) {
      throw error;
    }
  }

async function getById(user_id) {
    const query = `
      SELECT 
      id,
      name, 
      email,
      password, 
      role,
      created_at, 
      updated_at
      FROM users 
      WHERE id = ?
      `;

    try {
        const [rows] = await pool.execute(query, [user_id]);
        return rows[0];
    } catch (error) {
        throw error;
    }
}

async function update(user_id, user_info) {
    const { name, email, password, role } = user_info;
    const queryParams = [];
    const updateFields = [];

    if (name) {
        updateFields.push("name = ?");
        queryParams.push(name);
    }
    if (email) {
        updateFields.push("email = ?");
        queryParams.push(email);
    }
    if (password) {
        const hashed_password = bcrypt.hashSync(password, 10);
        updateFields.push("password = ?");
        queryParams.push(hashed_password);
    }
    if (role) {
        updateFields.push("role = ?");
        queryParams.push(role);
    }

    if (updateFields.length === 0) {
        throw new Error("No fields provided for update.");
    }

    queryParams.push(user_id);

    const query = `
      UPDATE users
      SET ${updateFields.join(", ")}
      WHERE id = ?
    `;

    try {
        const [results] = await pool.execute(query, queryParams);
        return results;
    } catch (error) {
        throw error;
    }
}

async function remove(user_id) {
    const query = `
      DELETE FROM users 
      WHERE id = ?
    `;

    try {
        const [results] = await pool.execute(query, [user_id]);
        return results;
    } catch (error) {
        throw error;
    }
}

async function checkExistingUser(email = null) {
    const query = `
  SELECT * FROM USERS WHERE EMAIL = ?
    `;
  
    try {
      const [rows] = await pool.query(query, [email]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

module.exports = {
    create,
    getAll,
    getById,
    update,
    remove,
    checkExistingUser
};
