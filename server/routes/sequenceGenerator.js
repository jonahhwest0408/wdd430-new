const Sequence = require('../models/sequence');

class SequenceGenerator {
  constructor() {
    this.sequenceId = null;
    this.maxDocumentId = 0;
    this.maxMessageId = 0;
    this.maxContactId = 0;
  }

  async init() {
    let sequence = await Sequence.findOne();
    if (!sequence) {
      sequence = await new Sequence({
        id: '0',
        maxDocumentId: 0,
        maxMessageId: 0,
        maxContactId: 0
      }).save();
    }
    this.sequenceId = sequence._id;
    this.maxDocumentId = sequence.maxDocumentId || 0;
    this.maxMessageId = sequence.maxMessageId || 0;
    this.maxContactId = sequence.maxContactId || 0;
  }

  async nextId(collectionType) {
    let updateObject = {};
    let nextId;

    switch (collectionType) {
      case 'documents':
        this.maxDocumentId++;
        updateObject = { maxDocumentId: this.maxDocumentId };
        nextId = this.maxDocumentId;
        break;
      case 'messages':
        this.maxMessageId++;
        updateObject = { maxMessageId: this.maxMessageId };
        nextId = this.maxMessageId;
        break;
      case 'contacts':
        this.maxContactId++;
        updateObject = { maxContactId: this.maxContactId };
        nextId = this.maxContactId;
        break;
      default:
        return -1;
    }

    await Sequence.updateOne({ _id: this.sequenceId }, { $set: updateObject });
    return nextId;
  }
}

module.exports = new SequenceGenerator();
