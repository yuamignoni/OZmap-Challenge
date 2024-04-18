import app from "./app";
import "./database";

const PORT = process.env.PORT || 3000;

export default app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
