import app, { dbProvider } from "./app";

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  await dbProvider.connect();
  console.log(`🔥 Server is running on port ${PORT}`);
});

process.on("SIGINT", async () => {
  await dbProvider.disconnect();
  process.exit(0);
});
