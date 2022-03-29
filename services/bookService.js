require("dotenv").config();
const axios = require("axios").default;

class BookService {
  getBooks = async () => {
    try {
      const baseUrl = "https://sheets.googleapis.com/v4/spreadsheets/";
      const spreadsheetId = "1e3iKWRYHLQgT_xxEpoyVyS8YhPZq_BMZZo856krlhcc/";
      const range = "Books!A:K";

      const headers = {
        Authorization: "Bearer " + process.env.GOOGLE_API_KEY,
        Accept: "application/json",
      };
      const result = await axios.get(
        baseUrl +
          spreadsheetId +
          "values/" +
          range +
          "?key=" +
          process.env.GOOGLE_API_KEY,
        headers
      );
      const [columnName, ...rows] = result.data.values;
      const books = rows.map((row) =>
        row.reduce((a, b, index) => {
          return { ...a, [columnName[index]]: b };
        }, {})
      );
      return books;
    } catch (err) {
      return res.status(500).json({ message: err });
      console.log(err);
    }
  };
}

module.exports = BookService;
