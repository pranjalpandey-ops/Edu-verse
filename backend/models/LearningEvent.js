const { memoryStore } = require('../utils/db');

function getModel() {
  const mem = memoryStore.collection('learningevents');
  return {
    find: (q) => mem.find(q),
    findOne: (q) => mem.findOne(q),
    findById: (id) => mem.findById(id),
    create: (doc) => mem.create(doc),
    insertMany: (docs) => mem.insertMany(docs),
    findByIdAndUpdate: (id, u, o) => mem.findByIdAndUpdate(id, u, o),
    updateOne: (q, u) => mem.updateOne(q, u),
    deleteOne: (q) => mem.deleteOne(q),
    findByIdAndDelete: (id) => mem.findByIdAndDelete(id),
    countDocuments: (q) => mem.countDocuments(q),
    _rawMemory: mem
  };
}

module.exports = getModel();
