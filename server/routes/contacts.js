const express = require('express');
const router = express.Router();

const sequenceGenerator = require('./sequenceGenerator');
const Contact = require('../models/contact');

// GET all contacts with groups populated
router.get('/', (req, res, next) => {
  Contact.find()
    .populate('group')
    .then(contacts => {
      res.status(200).json({
        message: 'Contacts fetched successfully!',
        contacts: contacts
      });
    })
    .catch(error => {
      res.status(500).json({
        message: 'An error occurred',
        error: error
      });
    });
});

// POST a new contact
router.post('/', async (req, res, next) => {
  try {
    const nextId = await sequenceGenerator.nextId('contacts');
    const contact = new Contact({
      id: nextId,
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      imageUrl: req.body.imageUrl,
      group: req.body.group
    });

    const result = await contact.save();
    res.status(201).json({
      message: 'Contact created successfully',
      contact: result
    });
  } catch (err) {
    res.status(500).json({
      message: 'Error creating contact',
      error: err
    });
  }
});

// PUT (update) a contact by ID
router.put('/:id', (req, res, next) => {
  Contact.findOne({ id: req.params.id })
    .then(contact => {
      contact.name = req.body.name;
      contact.email = req.body.email;
      contact.phone = req.body.phone;
      contact.imageUrl = req.body.imageUrl;
      contact.group = req.body.group;

      Contact.updateOne({ id: req.params.id }, contact)
        .then(result => {
          res.status(204).json({
            message: 'Contact updated successfully'
          });
        })
        .catch(error => {
          res.status(500).json({
            message: 'An error occurred',
            error: error
          });
        });
    })
    .catch(error => {
      res.status(500).json({
        message: 'Contact not found.',
        error: { contact: 'Contact not found' }
      });
    });
});

// DELETE a contact by ID
router.delete('/:id', (req, res, next) => {
  Contact.findOne({ id: req.params.id })
    .then(contact => {
      Contact.deleteOne({ id: req.params.id })
        .then(result => {
          res.status(204).json({
            message: 'Contact deleted successfully'
          });
        })
        .catch(error => {
          res.status(500).json({
            message: 'An error occurred',
            error: error
          });
        });
    })
    .catch(error => {
      res.status(500).json({
        message: 'Contact not found.',
        error: { contact: 'Contact not found' }
      });
    });
});

module.exports = router;
