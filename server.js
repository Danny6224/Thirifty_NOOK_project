const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');
const itemRoutes = require('./routes/itemRoutes');
const session = require('express-session');
const { body, validationResult } = require('express-validator');

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.get('/create', (req, res) => {
  res.render('itemForm'); // Make sure itemForm.ejs exists in your views directory
});

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.use(express.static(path.join(__dirname, 'public')));

mongoose
  .connect(
    process.env.DB_URI,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log('Connected to the database!');
  })
  .catch((error) => {
    console.error('Error connecting to the database:', error);
  });

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(
  session({
    secret: 'my secret key',
    saveUninitialized: true,
    resave: false,
  })
);

app.use((req, res, next) => {
  res.locals.message = req.session.message;
  delete req.session.message;
  next();
});

app.set('view engine', 'ejs');

// // Validation middleware for creating an item
// const createItemValidation = [
//   body('title').notEmpty().withMessage('Title is required'),
//   body('images').isArray({ min: 1 }).withMessage('At least one image is required'),
//   body('price').isNumeric().withMessage('Price must be a number'),
//   // Add more validation rules for other fields if needed
// ];

app.post('/api/items/create', createItemValidation, async (req, res) => {
  try {
    // // Data validation
    // const errors = validationResult(req);
    // if (!errors.isEmpty()) {
    //   return res.status(400).json({ errors: errors.array() });
    // }

    // Extract data from the request body
    const { title, images, description, price, tags } = req.body;

    // Create a new item object
    const newItem = new Item({
      title,
      images,
      description,
      price,
      tags,
    });

    // Save the new item to the database (make sure you've defined the Item schema and model)
    const savedItem = await newItem.save();

    // Respond with the saved item
    res.status(201).json({ success: true, data: savedItem });
  } catch (error) {
    console.error('Error creating item:', error);
    res.status(500).json({ success: false, error: 'Item creation failed. Please try again later.' });
  }
});

app.use('/api/items', itemRoutes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

