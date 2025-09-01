import express from 'express';

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Auth service is running 🚀');
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Auth service listening on port ${PORT}`);
});
