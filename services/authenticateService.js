const query = require("../utils/query");

class AuthenticateService {
  getUser = async (email) => {
    try {
      const queryString = `select * from users where email = ? and deleted = 0`;
      const args = [email];
      const fn = async (conn) => {
        const [rows] = await conn.query(queryString, args);
        return rows;
      };
      return await query(fn);
    } catch (err) {
      throw new Error(err);
    }
  };

  saveUser = async (email, hashedPassword) => {
    try {
      const queryString = `insert ignore into users(email, password, created_at) values(?, ?, now())`;
      const args = [email, hashedPassword];
      const fn = async (conn) => {
        const [object] = await conn.query(queryString, args);
        return object.insertId;
      };
      return await query(fn);
    } catch (err) {
      throw new Error(err);
    }
  };
}

module.exports = AuthenticateService;
