const express = require('express');
const router = express.Router();
const itemController = require('../controllers/itemController');
const { body } = require('express-validator');

router.get('/item', (req, res) => {
  res.send('All Items');
});

// Validation middleware for creating an item
const createItemValidation = [
  body('title').notEmpty().withMessage('Title is required'),
  body('images').isArray({ min: 1 }).withMessage('At least one image is required'),
  body('price').isNumeric().withMessage('Price must be a number'),
  // Add more validation rules for other fields if needed
];

// Route to create a new item
router.post('/create', createItemValidation, itemController.createItem);

// Route to update an existing item by ID
router.put('/:id', itemController.updateItem);

// Route to delete an item by ID
router.delete('/:id', itemController.deleteItem);

// Route to get an item by its unique ID
router.get('/:id', itemController.getItemById);

// Route to get a list of all items
router.get('/list', itemController.getAllItems);

module.exports = router;



