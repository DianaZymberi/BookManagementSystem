const pool = require("../config/database.config");

async function paginate(
    selectQuery,
    countQuery,
    page,
    limit,
    offset,
    queryParams = null
  ) {
    if (queryParams === null) {
      queryParams = [];
    } else {
      queryParams = queryParams;
    }
  
    if (limit || offset) {
      selectQuery += "\n LIMIT ? OFFSET ?";
      queryParams.push(limit, offset);
    }
  
    try {
      const [rows] = await pool.query(selectQuery, queryParams);
      const [countRows] = await pool.query(countQuery, queryParams);
      const totalCount = countRows[0]?.total || 0;
  
      const totalPages = Math.ceil(totalCount / limit);
      const nextPage = page < totalPages ? page + 1 : null;
      const previousPage = page > 1 ? page - 1 : null;
  
      return {
        data: rows,
        totalCount: totalCount,
        totalPages: totalPages || 1,
        prevPage: previousPage,
        currentPage: page,
        nextPage: nextPage,
      };
    } catch (error) {
      throw error;
    }
  }

module.exports = { paginate };
