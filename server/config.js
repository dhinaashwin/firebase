
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


const mongoURI = 'mongodb+srv://dhinaashwin11:Mongodbpassword@cluster0.j76mlht.mongodb.net/new-database?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('MongoDB connected');
}).catch(err => {
  console.error('MongoDB connection error:', err);
});

const itemSchema = new mongoose.Schema({
  name: String,
  price: Number,
  imageUrl: String
});

const Item = mongoose.model('Item', itemSchema);

// POST endpoint to save item to MongoDB
app.post('/upload', async (req, res) => {
  const { name, price, imageUrl } = req.body;
  try {
    const newItem = new Item({ name, price, imageUrl });
    await newItem.save();
    res.status(201).send('Item saved to MongoDB');
  } catch (error) {
    console.error('Error saving item:', error);
    res.status(500).send('Failed to save item');
  }
});

// GET endpoint to fetch all items from MongoDB
app.get('/items', async (req, res) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (error) {
    console.error('Error fetching items:', error);
    res.status(500).send('Failed to fetch items');
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});


