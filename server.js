const express = require("express");
const app = express();
const PORT = 8080;
const AddPet = require("./routes/AddPet");
const GetPets = require("./routes/GetPets");
const search = require("./routes/search");
const user = require("./routes/User");
const cors = require("cors");
const cookieParser = require("cookie-parser");

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
    withCredentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.use("/addpet", AddPet);

app.use("/pet", GetPets);

app.use("/search", search);

app.use("/user", user);
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
