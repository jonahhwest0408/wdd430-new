const express = require('express');
const router = express.Router();

const sequenceGenerator = require('./sequenceGenerator');
const Document = require('../models/document');

// GET all documents
router.get('/', (req, res, next) => {
  Document.find()
    .then(documents => {
      res.status(200).json({
        message: 'Documents fetched successfully!',
        documents: documents
      });
    })
    .catch(error => {
      res.status(500).json({
        message: 'An error occurred',
        error: error
      });
    });
});

// POST a new document
router.post('/', async (req, res, next) => {
  try {
    const maxDocumentId = await sequenceGenerator.nextId("documents");

    const document = new Document({
      id: maxDocumentId,
      name: req.body.name,
      description: req.body.description,
      url: req.body.url,
      children: req.body.children || []
    });

    const createdDocument = await document.save();
    res.status(201).json({
      message: 'Document added successfully',
      document: createdDocument
    });
  } catch (error) {
    res.status(500).json({
      message: 'An error occurred',
      error: error
    });
  }
});

// PUT (update) a document by ID
router.put('/:id', (req, res, next) => {
  Document.findOne({ id: req.params.id })
    .then(document => {
      document.name = req.body.name;
      document.description = req.body.description;
      document.url = req.body.url;
      document.children = req.body.children;

      Document.updateOne({ id: req.params.id }, document)
        .then(result => {
          res.status(204).json({
            message: 'Document updated successfully'
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
        message: 'Document not found.',
        error: { document: 'Document not found' }
      });
    });
});

// DELETE a document by ID
router.delete('/:id', (req, res, next) => {
  Document.findOne({ id: req.params.id })
    .then(document => {
      Document.deleteOne({ id: req.params.id })
        .then(result => {
          res.status(204).json({
            message: 'Document deleted successfully'
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
        message: 'Document not found.',
        error: { document: 'Document not found' }
      });
    });
});

module.exports = router;
