const Item = require('../models/item');
const { validationResult } = require('express-validator');

// Create a new item
exports.createItem = async (req, res) => {
  try {
    // Data validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

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

    // Save the new item to the database
    const savedItem = await newItem.save();

    // Respond with the saved item
    res.status(201).json({ success: true, data: savedItem });
  } catch (error) {
    console.error('Error creating item:', error);
    res.status(500).json({ success: false, error: 'Item creation failed. Please try again later.' });
  }
};

// Update an existing item by ID
exports.updateItem = async (req, res) => {
  try {
    // Data validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const itemId = req.params.id;
    const { title, images, description, price, tags } = req.body;

    const updatedItem = await Item.findByIdAndUpdate(
      itemId,
      {
        title,
        images,
        description,
        price,
        tags,
      },
      { new: true }
    );

    if (!updatedItem) {
      return res.status(404).json({ success: false, error: 'Item not found' });
    }

    res.json({ success: true, data: updatedItem });
  } catch (error) {
    console.error('Error updating item:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

// Delete an item by ID
exports.deleteItem = async (req, res) => {
  try {
    const itemId = req.params.id;

    const deletedItem = await Item.findByIdAndDelete(itemId);

    if (!deletedItem) {
      return res.status(404).json({ success: false, error: 'Item not found' });
    }

    res.json({ success: true, data: deletedItem });
  } catch (error) {
    console.error('Error deleting item:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

// Get an item by ID
exports.getItemById = async (req, res) => {
  try {
    const itemId = req.params.id;

    const item = await Item.findById(itemId);

    if (!item) {
      return res.status(404).json({ success: false, error: 'Item not found' });
    }

    res.json({ success: true, data: item });
  } catch (error) {
    console.error('Error getting item by ID:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

// Get a list of all items
exports.getAllItems = async (req, res) => {
  try {
    const items = await Item.find();
    res.json({ success: true, data: items });
  } catch (error) {
    console.error('Error getting all items:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};


