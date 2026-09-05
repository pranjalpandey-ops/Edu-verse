const { User, StudentProfile, Lesson } = require('../models');

exports.getProgress = async (req, res) => {
  try {
    const user = req.user || await User.findOne({ email: 'pranjal@eduverse.ai' }) || { name: 'Student' };
    const latestLesson = await Lesson.findOne({ userId: user._id }) || await Lesson.findOne({}) || {
      _id: "lesson_active",
      subject: "Science & Engineering",
      title: "Interactive Mastery",
      progress: 60,
      thumbnail: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80"
    };
    
    res.json({
      success: true,
      dashboard: {
        userName: user.name || "Student",
        greeting: "Welcome back, " + (user.name || "Student"),
        subtitle: "Ready to continue your AI learning journey?",
        todayGoal: { targetMins: 60, completedMins: 45, text: "60m", subText: "45m done" },
        learningStreak: { days: user.streak || 12, delta: "+2 this week" },
        hoursLearned: { hours: user.hoursLearned || 24.5, period: "This month" },
        overallProgress: { percentage: user.overallProgress || 78 },
        continueLearning: {
          id: latestLesson._id,
          subject: latestLesson.subject || "Natural Sciences",
          title: latestLesson.title || "Interactive Lecture",
          description: "Continue exploring concepts and visual derivations with ARIA AI...",
          progress: latestLesson.progress || 65,
          thumbnail: latestLesson.thumbnail || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80"
        },
        attentionNeeded: {
          concept: "Boundary Conditions",
          description: "AI detected opportunities to solidify constraints and governing laws.",
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
            title: "Advanced Systems",
            duration: "30 mins",
            image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=300&q=80"
          },
          {
            id: "rec_2",
            badge: "AI CURATED",
            title: "Problem Solving Lab",
            duration: "20 mins",
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
      { concept: "Boundary Conditions", score: 65, reason: "Constraint verification during parameter changes" },
      { concept: "Inverse Proportions", score: 70, reason: "Ratio calculation speed" }
    ];
    res.json({ success: true, weakAreas });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
