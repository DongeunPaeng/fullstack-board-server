const query = require("../utils/query");

class PostService {
    getPost = async (postId) => {
        try {
            const queryString = `select A.id, A.post, A.created_at, A.title, B.email as author, A.author as author_id, B.deleted as deleted, A.type as type from posts A left join users B on A.author = B.id where A.id = ? and A.status = 0`;
            const args = [postId];
            const fn = async (conn) => {
                const [rows] = await conn.query(queryString, args);
                return rows;
            };
            return await query(fn);
        } catch (err) {
            throw new Error(err);
        }
    };

    getPreviousPost = async (post) => {
        try {
            const queryString = `select A.id, A.post, A.created_at, A.title, B.email as author, A.author as author_id, B.deleted as deleted, A.type as type from posts A left join users B on A.author = B.id where A.created_at < ? and A.status = ? order by A.created_at desc limit 1`;
            const args = [post.created_at, post.type];
            const fn = async (conn) => {
                const [rows] = await conn.query(queryString, args);
                return rows;
            };
            return await query(fn);
        } catch (err) {
            throw new Error(err);
        }
    };

    getPosts = async () => {
        try {
            const queryString = `select A.id, A.post, A.created_at, A.title, B.email as author, A.author as author_id, B.deleted as deleted, A.type as type from posts A left join users B on A.author = B.id where A.status = 0 order by A.created_at desc`;
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

    getDraft = async (postId) => {
        try {
            const queryString = `select A.id, A.post, A.created_at, A.title, B.email as author, A.author as author_id, B.deleted as deleted, A.type as type from posts A left join users B on A.author = B.id where A.id = ?`;
            const args = [postId];
            const fn = async (conn) => {
                const [rows] = await conn.query(queryString, args);
                return rows;
            };
            return await query(fn);
        } catch (err) {
            throw new Error(err);
        }
    };

    getDrafts = async () => {
        try {
            const queryString = `select A.id, A.post, A.created_at, A.title, B.email as author, A.author as author_id, B.deleted as deleted, A.type as type from posts A left join users B on A.author = B.id where A.status > 0 order by A.created_at desc`;
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

    writePost = async (title, id, post, type, status) => {
        try {
            const queryString = `insert into posts (author, post, title, type, status, created_at) values (?, ?, ?, ?, ?, now())`;
            const args = [id, post, title, type, status];
            const fn = async (conn) => {
                const [rows] = await conn.query(queryString, args);
                return rows.insertId;
            };
            return await query(fn);
        } catch (err) {
            throw new Error(err);
        }
    };

    editPost = async (title, post, postId, type, status) => {
        try {
            const queryString = `update posts set title = ?, post = ?, type = ?, status = ? where id = ?`;
            const args = [title, post, type, status, postId];
            const fn = async (conn) => {
                const [rows] = await conn.query(queryString, args);
                return rows.insertId;
            };
            return await query(fn);
        } catch (err) {
            throw new Error(err);
        }
    };

    deletePost = async (postId) => {
        try {
            const queryString = `update posts set status = 1 where id = ?`;
            const args = [postId];
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

module.exports = PostService;
