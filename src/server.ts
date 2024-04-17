import app from "./app";
import { connectDatabase } from "./database";

const PORT = process.env.PORT || 3000;
connectDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  });
