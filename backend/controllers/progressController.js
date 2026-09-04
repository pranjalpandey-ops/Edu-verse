const { User, StudentProfile, Lesson } = require('../models');

exports.getProgress = async (req, res) => {
  try {
    const user = req.user || await User.findOne({ email: 'pranjal@eduverse.ai' }) || { name: 'Pranjal' };
    
    res.json({
      success: true,
      dashboard: {
        userName: user.name || "Pranjal",
        greeting: "Good morning, " + (user.name || "Pranjal"),
        subtitle: "Ready to master physics today?",
        todayGoal: { targetMins: 60, completedMins: 45, text: "60m", subText: "45m done" },
        learningStreak: { days: 12, delta: "+2 from last week" },
        hoursLearned: { hours: 24.5, period: "This month" },
        overallProgress: { percentage: 78 },
        continueLearning: {
          id: "lesson_physics_electricity",
          subject: "Physics",
          title: "Physics: Electricity",
          description: "Master the fundamentals of electric current, voltage, and resistance through interactive AI...",
          progress: 65,
          thumbnail: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=600&q=80"
        },
        attentionNeeded: {
          concept: "Ohm's Law",
          description: "AI detected recurring struggles in recent quizzes regarding circuit resistance calculations.",
          actionText: "Start Quick Revision"
        },
        weeklyActivity: [
          { day: "MON", hours: 2.1 },
          { day: "TUE", hours: 3.4 },
          { day: "WED", hours: 1.8 },
          { day: "THU", hours: 4.2, active: true },
          { day: "FRI", hours: 2.9 },
          { day: "SAT", hours: 3.8 },
          { day: "SUN", hours: 1.5 }
        ],
        recommendedForYou: [
          {
            id: "rec_1",
            badge: "UP NEXT",
            title: "Advanced Circuits",
            duration: "45 mins",
            image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=300&q=80"
          },
          {
            id: "rec_2",
            badge: "NEW SUBJECT",
            title: "Intro to Quantum...",
            duration: "AI Curated",
            icon: "atom"
          }
        ]
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getWeakAreas = async (req, res) => {
  try {
    const weakAreas = [
      { concept: "Resistance", score: 60, reason: "Reversed inverse relationship with current" },
      { concept: "Ohm's Law", score: 50, reason: "Circuit resistance calculation confusion" }
    ];
    res.json({ success: true, weakAreas });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
