const express = require("express");
const { connectToMongoDB } = require("./connect");
const urlRouter = require("./routes/url");
const URL = require("./models/url");
const app = express();
const PORT = 3001;
const MONGO_URL = "mongodb://127.0.0.1:27017/short-url";

app.use(express.json());
app.use("/url", urlRouter);

app.get("/:shortId", async (req, res) => {
  const shortId = req.params.shortId;
  const entry = await URL.findOneAndUpdate(
    {
      shortId,
    },
    {
      $push: {
        visitHistory: {
           timestamp: Date.now()
        },
      },
    }
  );
  res.redirect(entry.redirectURL)
});

connectToMongoDB(MONGO_URL)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Failed to connect to MongoDB", error);
  });
