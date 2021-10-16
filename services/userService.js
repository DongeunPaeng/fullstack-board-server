const query = require("../utils/query");

class UserService {
  deleteUser = async (id) => {
    try {
      const queryString = `update users set deleted = 1 where id = ?`;
      const args = [id];
      const fn = async (conn) => {
        const [rows] = await conn.query(queryString, args);
        return rows.insertId;
      };
      return await query(fn);
    } catch (err) {
      throw new Error(err);
    }
  };
}

module.exports = UserService;
