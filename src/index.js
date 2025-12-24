import dotenv from "dotenv";
dotenv.config({path: "./.env"});

import connectDB from "./db/index.js";
const startServer = async () => {
  try {
    await connectDB();   // 👈 yahan await

    app.on("error", (err) => {
      console.error("Server error:", err);
    });

    app.listen(process.env.PORT || PORT, () => {
      console.log(`Server is running on port ${process.env.PORT || PORT}`);
    });

  } catch (err) {
    console.error("Failed to connect to the database", err);
    process.exit(1); // optional but recommended
  }
};

startServer();
