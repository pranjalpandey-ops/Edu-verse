const { memoryStore, getIsMongoConnected } = require('../utils/db');

function getModel(name) {
  const collectionName = name.toLowerCase() + 's';
  const mem = memoryStore.collection(collectionName);
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
  ConceptMastery: getModel('ConceptMastery'),
  Misconception: getModel('Misconception'),
  LearningPath: getModel('LearningPath'),
  Note: getModel('Note'),
  StudyPlan: getModel('StudyPlan'),
  VideoLearning: getModel('VideoLearning'),
  Quiz: getModel('Quiz'),
  QuizAttempt: getModel('QuizAttempt'),
  QuizRoom: getModel('QuizRoom'),
  QuizParticipant: getModel('QuizParticipant'),
  Conversation: getModel('Conversation')
};
