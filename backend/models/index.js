const { memoryStore } = require('../utils/db');

function getModel(name) {
  const collectionName = name.toLowerCase() + (name.toLowerCase().endsWith('s') ? 'es' : 's');
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
  LearningProfile: require('./LearningProfile'),
  Material: getModel('Material'),
  DocumentChunk: getModel('DocumentChunk'),
  Lesson: getModel('Lesson'),
  LessonSession: getModel('LessonSession'),
  Question: getModel('Question'),
  Assessment: getModel('Assessment'),
  LearningProgress: getModel('LearningProgress'),
  ConceptMastery: require('./ConceptMastery'),
  LearningEvent: require('./LearningEvent'),
  ReviewItem: require('./ReviewItem'),
  Flashcard: require('./Flashcard'),
  StudyPlan: require('./StudyPlan'),
  ConceptRelation: require('./ConceptRelation'),
  DailyChallenge: require('./DailyChallenge'),
  Homework: require('./Homework'),
  Misconception: getModel('Misconception'),
  LearningPath: getModel('LearningPath'),
  Note: getModel('Note'),
  VideoLearning: getModel('VideoLearning'),
  Quiz: getModel('Quiz'),
  QuizAttempt: getModel('QuizAttempt'),
  QuizRoom: getModel('QuizRoom'),
  QuizParticipant: getModel('QuizParticipant'),
  Conversation: getModel('Conversation')
};
