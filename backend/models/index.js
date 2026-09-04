const { memoryStore, getIsMongoConnected } = require('../utils/db');

function getModel(name) {
  const mem = memoryStore.collection(name.toLowerCase() + 's');
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

module.exports = {
  User: getModel('User'),
  StudentProfile: getModel('StudentProfile'),
  Material: getModel('Material'),
  DocumentChunk: getModel('DocumentChunk'),
  Lesson: getModel('Lesson'),
  LessonSession: getModel('LessonSession'),
  Question: getModel('Question'),
  Assessment: getModel('Assessment'),
  LearningProgress: getModel('LearningProgress'),
  Misconception: getModel('Misconception'),
  LearningPath: getModel('LearningPath'),
  Note: getModel('Note')
};
