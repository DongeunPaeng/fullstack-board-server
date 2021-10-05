const query = require("../utils/query");

class PostService {
  getPosts = async () => {
    try {
      const queryString = `select A.id, A.post, A.created_at, A.title, B.email as author from posts A left join users B on A.author = B.id`;
      const args = [];
      const fn = async (conn) => {
        const [rows] = await conn.query(queryString, args);
        return rows;
      };
      return await query(fn);
    } catch (err) {
      throw new Error(err);
    }
  };

  // FIXME dongeun: finish this service
  writePost = async (id, post) => {
    try {
      const queryString = `insert into posts (author, post, title, created_at) values (?, ?, 'Title Not Yet', now())`;
      const args = [id, post];
      const fn = async (conn) => {
        const [rows] = await conn.query(queryString, args);
        return rows;
      };
      return await query(fn);
    } catch (err) {
      throw new Error(err);
    }
  };
}

module.exports = PostService;
