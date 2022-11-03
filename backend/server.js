const app = require("./app");
const dotenv = require("dotenv");
const connectDatabase = require("./config/database");

// config
dotenv.config();
connectDatabase();

// listening the app
app.listen(process.env.PORT, () => {
  console.log(`server is running on http://localhost:${process.env.PORT}`);
});
