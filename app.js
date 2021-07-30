const express = require("express");
require("./db/mongoose");
const app = express();

//Router files;
app.use(express.json());
const users = require("./routers/users");
const products = require("./routers/products");

const PORT = 2020;

//Mount routers
app.use("/api/v2/users", users);
app.use("/api/v2/products", products);

app.listen(PORT, () => {
  `App is up on port:${PORT}`;
});
