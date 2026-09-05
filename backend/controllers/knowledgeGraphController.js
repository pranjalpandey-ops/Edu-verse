const { ConceptRelation, ConceptMastery } = require('../models');
const aiService = require('../services/aiService');

exports.getPrerequisites = async (req, res, next) => {
  try {
    const userId = req.user?.id || 'demo_user';
    const { topic = 'General', subject = 'General' } = req.query;

    let relations = await ConceptRelation.find({ concept: topic });

    if (relations.length === 0) {
      const extracted = await aiService.extractConceptRelations({ topic, subject });
      for (const rel of extracted) {
        const created = await ConceptRelation.create({
          subject,
          concept: topic,
          relatedConcept: rel.relatedConcept,
          relationType: rel.relationType || 'prerequisite'
        });
        relations.push(created);
      }
    }

    const masteries = await ConceptMastery.find({ userId: userId.toString() });
    const relationsWithMastery = relations.map(r => {
      const m = masteries.find(x => x.concept.toLowerCase() === r.relatedConcept.toLowerCase());
      return {
        ...r,
        studentMastery: m ? m.masteryScore : 50,
        isPrerequisiteMet: m ? m.masteryScore >= 60 : true
      };
    });

    const unmetPrereq = relationsWithMastery.find(r => r.relationType === 'prerequisite' && !r.isPrerequisiteMet);

    res.json({
      success: true,
      topic,
      relations: relationsWithMastery,
      warning: unmetPrereq ? `You may want to review ${unmetPrereq.relatedConcept} first (Current Mastery: ${unmetPrereq.studentMastery}%).` : null
    });
  } catch (err) {
    next(err);
  }
};
