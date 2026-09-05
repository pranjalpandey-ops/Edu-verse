// In-memory store for custom scheduled lectures
let customLectures = [];

class StudyPlanController {
  async getStudyPlan(req, res) {
    try {
      const plan = {
        studentGoal: 'Master Class 9-12 STEM Curriculum & Board/Competitive Prep',
        dailyTargetMinutes: 60,
        streakDays: 7,
        timetableSynced: true,
        routine: {
          schoolHours: '08:00 AM - 02:00 PM',
          coachingHours: '04:30 PM - 06:30 PM',
          freeStudySlots: ['06:45 AM - 07:45 AM (Formula Recall)', '07:30 PM - 09:00 PM (Deep Concept Study)', '09:15 PM - 10:00 PM (Mock Quiz)']
        },
        currentWeek: [
          { day: 'Mon', topic: 'Physics: Ray Optics & Snell’s Law', status: 'completed', duration: 45, slot: 'Evening Slot 1 (07:30 PM)' },
          { day: 'Tue', topic: 'Math: Integrals by Parts & Trigonometric Substitutions', status: 'completed', duration: 50, slot: 'Evening Slot 1 (07:30 PM)' },
          { day: 'Wed', topic: 'Chemistry: Electrochemistry & Nernst Equation', status: 'completed', duration: 45, slot: 'Evening Slot 1 (07:30 PM)' },
          { day: 'Thu', topic: 'Biology: Molecular Basis of Inheritance (DNA Replication)', status: 'in-progress', duration: 50, slot: 'Evening Slot 1 (07:30 PM)' },
          { day: 'Fri', topic: 'Physics: Magnetic Effects of Current & Ampere’s Law', status: 'upcoming', duration: 45, slot: 'Evening Slot 1 (07:30 PM)' },
          { day: 'Sat', topic: 'Live Arena Mock Battle & Exam Prep', status: 'upcoming', duration: 60, slot: 'Weekend Morning (10:00 AM)' },
          { day: 'Sun', topic: 'Class 9-12 Master Formula Revision & Weak Area Boost', status: 'upcoming', duration: 45, slot: 'Evening Revision (07:00 PM)' }
        ],
        milestones: [
          { title: 'Class 9-10 Foundations & Key Identities', progress: 100, achieved: true },
          { title: 'Class 11 Core Mechanics & Thermodynamics', progress: 85, achieved: false },
          { title: 'Class 12 Board & Competitive Simulation (JEE/NEET/CBSE)', progress: 62, achieved: false }
        ],
        recommendedActions: [
          'Review 4 Due Formulas in Electromagnetic Induction before 07:30 PM',
          'Complete today’s 45m deep dive: Molecular Basis of Inheritance',
          'Complete Class 12 Pre-Board Mock Test 2 (Upcoming in 4 days)'
        ]
      };

      return res.json({ success: true, plan });
    } catch (error) {
      console.error('[StudyPlanController] error:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async generatePlan(req, res) {
    try {
      const { goal, availableHoursPerWeek, targetExamDate, grade = 'class-12', subjects = ['physics', 'chemistry', 'mathematics', 'biology'] } = req.body;
      const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
      
      const subjectCurriculum = {
        physics: ['Ray & Wave Optics', 'Current Electricity & Kirchhoff\'s Laws', 'Electromagnetic Induction', 'Rotational Mechanics'],
        chemistry: ['Chemical Kinetics & Rate Law', 'Coordination Compounds', 'Solutions & Raoult\'s Law', 'Aldehydes & Ketones'],
        mathematics: ['Definite Integrals', '3D Geometry & Vectors', 'Matrices & Determinants', 'Differential Equations'],
        biology: ['DNA Replication & Gene Expression', 'Human Reproduction & Embryology', 'Biotechnology Principles', 'Ecology & Biodiversity']
      };

      const schedule = days.map((day, idx) => {
        const subjKey = subjects[idx % subjects.length] || 'physics';
        const subjList = subjectCurriculum[subjKey] || ['Core Topic Mastery', 'Practice Problems'];
        const topicName = subjList[idx % subjList.length];
        
        return {
          day,
          focusSubject: subjKey.charAt(0).toUpperCase() + subjKey.slice(1),
          topics: [`Lecture & Derivation: ${topicName}`, `Formula Drill & Past Year Problems`],
          durationMinutes: Math.round((parseInt(availableHoursPerWeek) || 12) * 60 / 7),
          recommendedSlot: idx % 2 === 0 ? 'Evening Deep Study (07:30 PM - 09:00 PM)' : 'Morning Formula Session (06:30 AM - 07:30 AM)'
        };
      });

      return res.json({
        success: true,
        plan: {
          goal: goal || `${grade.toUpperCase()} Academic & Board Mastery`,
          targetDate: targetExamDate || 'Next 30 Days',
          schedule,
          tips: [
            'Revise key formulas daily for 15 minutes before solving numericals.',
            'Follow the 25/5 Pomodoro rhythm tailored around your school & coaching timings.',
            'Take timed mock tests 48 hours before each scheduled exam.'
          ]
        }
      });
    } catch (error) {
      console.error('[StudyPlanController] generatePlan error:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async uploadTimetable(req, res) {
    try {
      const { 
        schoolStart = '08:00', 
        schoolEnd = '14:00', 
        coachingStart = '16:30', 
        coachingEnd = '18:30', 
        sleepTime = '23:00',
        wakeTime = '06:00',
        targetGrade = 'class-12',
        additionalNotes = ''
      } = req.body;

      // Extract uploaded file info if provided
      const fileName = req.file ? req.file.originalname : 'Uploaded_Timetable_Doc.pdf';

      // Synthesize optimized timetable slots based on student's commitments
      const morningSlot = `${wakeTime} - 07:30 AM (Morning Formula & Active Recall)`;
      const schoolSlot = `${schoolStart} - ${schoolEnd} (School / College Hours)`;
      const coachingSlot = `${coachingStart} - ${coachingEnd} (Coaching / Tuition)`;
      const eveningSlot1 = `07:15 PM - 08:45 PM (AI Guided Concept & Derivation)`;
      const eveningSlot2 = `09:15 PM - 10:15 PM (Numerical Practice & Mock Quiz)`;

      const generatedRoutine = {
        status: 'Timetable Synced & Active',
        fileName,
        parsedGrade: targetGrade.toUpperCase(),
        totalDailyStudyHours: 3.5,
        timeBlocks: [
          { time: morningSlot, type: 'Formula Quick-Revision', icon: '🌅', color: 'blue' },
          { time: schoolSlot, type: 'School / Academics', icon: '🏫', color: 'gray' },
          { time: coachingSlot, type: 'Coaching / Tuition', icon: '🎒', color: 'amber' },
          { time: eveningSlot1, type: 'EduVerse AI Deep Learning', icon: '💡', color: 'indigo' },
          { time: eveningSlot2, type: 'Timed Problem Solving & Flashcards', icon: '⚡', color: 'emerald' }
        ],
        weeklyStudyMatrix: [
          { day: 'Monday', morning: 'Physics: Formula Revision (Kinematics & Optics)', evening: 'Math: Integrals & Calculus Deep Dive' },
          { day: 'Tuesday', morning: 'Chemistry: Periodic Trends & Formula Review', evening: 'Physics: Electrostatics & Coulomb’s Law' },
          { day: 'Wednesday', morning: 'Math: Trigonometry & Vector Formulas', evening: 'Chemistry: Nernst Equation & Thermodynamics' },
          { day: 'Thursday', morning: 'Biology: Cell Division & Genetics Notes', evening: 'Biology: Molecular Genetics & Biotechnology' },
          { day: 'Friday', morning: 'Mixed Formula Rapid Fire (All Subjects)', evening: 'Live AI Practice Exam & Doubt Resolution' },
          { day: 'Saturday', morning: 'Full-Length Timed Test / Live Arena Quiz', evening: 'Weak Area Recovery & Error Log Analysis' },
          { day: 'Sunday', morning: 'Spaced Repetition & Summary Mindmaps', evening: 'Upcoming Week Preparation & Goal Reset' }
        ]
      };

      return res.json({
        success: true,
        message: 'Timetable uploaded and study routine successfully generated!',
        timetable: generatedRoutine
      });
    } catch (error) {
      console.error('[StudyPlanController] uploadTimetable error:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async getCalendarEvents(req, res) {
    try {
      const today = new Date();
      const formatYMD = (d) => d.toISOString().split('T')[0];

      const addDays = (n) => {
        const d = new Date(today);
        d.setDate(today.getDate() + n);
        return formatYMD(d);
      };

      const baseLectures = [
        {
          id: 'lec-101',
          title: 'Physics: Ray Optics & Lens Maker Derivation',
          subject: 'Physics',
          grade: 'class-12',
          date: formatYMD(today),
          startTime: '10:30 AM',
          endTime: '11:30 AM',
          status: 'live_ready',
          topicQuery: 'Ray Optics Lens Maker Formula and Snell Law',
          icon: '⚡',
          color: 'blue',
          keyFormulas: [
            { name: 'Lens Maker Formula', formula: '1/f = (n - 1) * (1/R1 - 1/R2)' },
            { name: 'Snell\'s Law', formula: 'n1 · sin(i) = n2 · sin(r)' },
            { name: 'Prism Formula', formula: 'μ = sin((A + δm)/2) / sin(A/2)' }
          ],
          objectives: ['Derive refraction at spherical surfaces', 'Master sign conventions', 'Solve 3 previous year questions']
        },
        {
          id: 'lec-102',
          title: 'Math: Integrals by Parts & Trigonometric Substitutions',
          subject: 'Mathematics',
          grade: 'class-12',
          date: formatYMD(today),
          startTime: '04:00 PM',
          endTime: '05:00 PM',
          status: 'live_ready',
          topicQuery: 'Integration by Parts and Trigonometric Substitution',
          icon: '📐',
          color: 'cyan',
          keyFormulas: [
            { name: 'Integration by Parts', formula: '∫u·v dx = u∫v dx - ∫(u\' · ∫v dx)dx' },
            { name: 'Standard Form', formula: '∫1/(a² + x²) dx = (1/a) · arctan(x/a) + C' },
            { name: 'Euler Exponential', formula: '∫e^(ax) · sin(bx) dx' }
          ],
          objectives: ['Master ILATE rule sequence', 'Solve definite integrals using King\'s property']
        },
        {
          id: 'lec-103',
          title: 'Chemistry: Electrochemistry & Nernst Equation Calculations',
          subject: 'Chemistry',
          grade: 'class-12',
          date: addDays(1),
          startTime: '11:00 AM',
          endTime: '12:00 PM',
          status: 'scheduled',
          topicQuery: 'Electrochemistry Nernst Equation and Kohlrausch Law',
          icon: '🧪',
          color: 'emerald',
          keyFormulas: [
            { name: 'Nernst Equation', formula: 'E_cell = E°_cell - (0.0591/n) · log10(Q)' },
            { name: 'Gibbs & EMF', formula: 'ΔG° = -n · F · E°_cell' },
            { name: 'Kohlrausch Law', formula: 'Λ°m = ν+ · λ°+ + ν- · λ°-' }
          ],
          objectives: ['Calculate standard cell potentials', 'Understand concentration cell mechanics']
        },
        {
          id: 'lec-104',
          title: 'Biology: Molecular Basis of Inheritance & DNA Replication',
          subject: 'Biology',
          grade: 'class-12',
          date: addDays(1),
          startTime: '03:30 PM',
          endTime: '04:30 PM',
          status: 'scheduled',
          topicQuery: 'DNA Replication Semi-Conservative Meselson Stahl',
          icon: '🧬',
          color: 'purple',
          keyFormulas: [
            { name: 'Chargaff\'s Rule', formula: 'A + G = T + C | (A/T = G/C = 1)' },
            { name: 'Replication Machinery', formula: 'DNA Polymerase III (5\' → 3\' directional synthesis)' }
          ],
          objectives: ['Trace leading and lagging strand synthesis', 'Understand Okazaki fragments']
        },
        {
          id: 'lec-105',
          title: 'Physics: Electromagnetic Induction & Lenz’s Law',
          subject: 'Physics',
          grade: 'class-12',
          date: addDays(2),
          startTime: '10:00 AM',
          endTime: '11:15 AM',
          status: 'scheduled',
          topicQuery: 'Electromagnetic Induction Faraday Law Lenz Law Self Inductance',
          icon: '⚡',
          color: 'blue',
          keyFormulas: [
            { name: 'Faraday\'s Law of Induction', formula: 'ε = -dΦ_B / dt' },
            { name: 'Self-Inductance Energy', formula: 'U = ½ · L · I²' },
            { name: 'Motional EMF', formula: 'ε = B · l · v' }
          ],
          objectives: ['Analyze induced EMF direction with Lenz’s Law', 'Compute mutual and self inductance']
        },
        {
          id: 'lec-106',
          title: 'Math: Vectors & 3D Geometry (Shortest Distance between Lines)',
          subject: 'Mathematics',
          grade: 'class-12',
          date: addDays(3),
          startTime: '05:00 PM',
          endTime: '06:00 PM',
          status: 'scheduled',
          topicQuery: '3D Geometry Shortest Distance Between Skew Lines Vector Algebra',
          icon: '📐',
          color: 'cyan',
          keyFormulas: [
            { name: 'Distance Between Skew Lines', formula: 'd = |(a2 - a1) · (b1 × b2)| / |b1 × b2|' },
            { name: 'Vector Dot Product', formula: 'a · b = |a||b| · cos(θ)' },
            { name: 'Vector Cross Product', formula: '|a × b| = |a||b| · sin(θ)' }
          ],
          objectives: ['Calculate shortest distance in cartesian & vector forms', 'Find angle between planes']
        },
        {
          id: 'lec-107',
          title: 'Class 10 Science: Light Reflection & Mirror Formula Masterclass',
          subject: 'Physics',
          grade: 'class-10',
          date: addDays(4),
          startTime: '02:00 PM',
          endTime: '03:00 PM',
          status: 'scheduled',
          topicQuery: 'Light Reflection and Refraction Mirror Formula Concave Convex',
          icon: '⚡',
          color: 'blue',
          keyFormulas: [
            { name: 'Mirror Formula', formula: '1/f = 1/v + 1/u' },
            { name: 'Linear Magnification', formula: 'm = -v/u = h\'/h' },
            { name: 'Power of Lens', formula: 'P = 1/f (in meters)' }
          ],
          objectives: ['Draw ray diagrams for concave and convex mirrors', 'Master numerical sign conventions']
        }
      ];

      const allEvents = [...baseLectures, ...customLectures];

      return res.json({
        success: true,
        events: allEvents,
        todayCount: allEvents.filter(e => e.date === formatYMD(today)).length
      });
    } catch (error) {
      console.error('[StudyPlanController] getCalendarEvents error:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async scheduleLecture(req, res) {
    try {
      const { title, subject, grade, date, time, topicQuery, formulas = [] } = req.body;
      
      const newLecture = {
        id: `custom-lec-${Date.now()}`,
        title: title || `${subject}: Live Guided Concept Deep Dive`,
        subject: subject || 'Physics',
        grade: grade || 'class-12',
        date: date || new Date().toISOString().split('T')[0],
        startTime: time || '10:00 AM',
        endTime: '11:00 AM',
        status: 'live_ready',
        topicQuery: topicQuery || title || 'Core Academic Topic',
        icon: subject === 'Physics' ? '⚡' : subject === 'Chemistry' ? '🧪' : subject === 'Mathematics' ? '📐' : '🧬',
        color: subject === 'Physics' ? 'blue' : subject === 'Chemistry' ? 'emerald' : subject === 'Mathematics' ? 'cyan' : 'purple',
        keyFormulas: formulas.length > 0 ? formulas : [
          { name: `${subject} Core Theorem`, formula: 'Master Relationships & Derivations' }
        ],
        objectives: ['Live voice explanation with ARIA AI', 'Interactive blackboard visualization', 'Active recall checkpoint']
      };

      customLectures.unshift(newLecture);

      return res.json({
        success: true,
        message: 'Live lecture successfully scheduled on calendar!',
        lecture: newLecture
      });
    } catch (error) {
      console.error('[StudyPlanController] scheduleLecture error:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async getExamSchedule(req, res) {
    try {
      const exams = [
        {
          id: 'exam-1',
          name: 'CBSE / Board Class 12 Physics Pre-Board',
          subject: 'Physics',
          grade: 'Class 12th',
          type: 'Board Examination',
          date: '2026-09-15',
          time: '10:30 AM - 01:30 PM',
          daysLeft: 10,
          status: 'Urgent Preparation',
          targetScore: '95%',
          syllabus: [
            'Electrostatics & Electric Potential',
            'Current Electricity & Kirchhoff\'s Laws',
            'Magnetic Effects & Ampere\'s Circuital Law',
            'Electromagnetic Waves & Ray Optics'
          ],
          keyFormulasToReview: [
            'Coulomb\'s Law: F = k*q1*q2/r²',
            'Lens Maker Formula: 1/f = (n-1)(1/R1 - 1/R2)',
            'Biot-Savart Law: dB = (μ₀/4π)*(I dl sinθ)/r²'
          ],
          checklist: [
            { item: 'Ray Optics Derivations (Prism & Lens)', completed: true },
            { item: 'Kirchhoff’s Law Numerical Sets (5 Solved)', completed: true },
            { item: 'Electromagnetic Waves Spectrum MCQs', completed: false },
            { item: 'Full 3-Hour Timed Sample Paper', completed: false }
          ]
        },
        {
          id: 'exam-2',
          name: 'Class 12 Mathematics Term Assessment',
          subject: 'Mathematics',
          grade: 'Class 12th',
          type: 'Unit Test & Internal',
          date: '2026-09-22',
          time: '09:00 AM - 12:00 PM',
          daysLeft: 17,
          status: 'On Track',
          targetScore: '98%',
          syllabus: [
            'Matrices and Determinants',
            'Continuity and Differentiability',
            'Integrals (Definite & Indefinite)',
            'Vector Algebra & 3D Geometry'
          ],
          keyFormulasToReview: [
            'Integration by Parts: ∫u v dx = u∫v dx - ∫(u\' ∫v dx)dx',
            'Distance Between Skew Lines: |(a2-a1) · (b1×b2)| / |b1×b2|',
            'Matrix Inverse: A⁻¹ = (1/|A|) * adj(A)'
          ],
          checklist: [
            { item: 'Matrix Inversion & System of Linear Equations', completed: true },
            { item: 'Definite Integral Properties (King\'s Property)', completed: true },
            { item: 'Shortest Distance between Skew Lines', completed: false },
            { item: 'Differential Equations Linear Form Practice', completed: false }
          ]
        },
        {
          id: 'exam-3',
          name: 'Class 11 / 12 JEE-NEET All-India Mock Test 3',
          subject: 'Physics, Chemistry & Math/Bio',
          grade: 'Competitive Arena',
          type: 'National Mock Simulation',
          date: '2026-09-28',
          time: '02:00 PM - 05:00 PM',
          daysLeft: 23,
          status: 'Strategic Revision',
          targetScore: '99th Percentile',
          syllabus: [
            'Mechanics, Work Energy & Power',
            'Chemical Thermodynamics & Equilibrium',
            'Calculus & Coordinate Geometry',
            'Genetics & Cell Biology'
          ],
          keyFormulasToReview: [
            'Nernst Equation: E = E° - (0.0591/n)log(Q)',
            'Conservation of Angular Momentum: L = Iω',
            'Gibbs Free Energy: ΔG = ΔH - TΔS'
          ],
          checklist: [
            { item: 'Previous 5 Years Question Papers (PYQs)', completed: true },
            { item: 'Speed-Accuracy Test on EduVerse Arena', completed: false },
            { item: 'Negative Marking Error Log Review', completed: false }
          ]
        },
        {
          id: 'exam-4',
          name: 'Class 10 Board Science Half-Yearly Exam',
          subject: 'Science (Physics, Chemistry, Biology)',
          grade: 'Class 10th',
          type: 'School Board Exam',
          date: '2026-10-05',
          time: '09:30 AM - 12:30 PM',
          daysLeft: 30,
          status: 'Scheduled',
          targetScore: '100%',
          syllabus: [
            'Chemical Reactions & Equations',
            'Acids, Bases and Salts',
            'Light - Reflection and Refraction',
            'Life Processes & Control and Coordination'
          ],
          keyFormulasToReview: [
            'Mirror Formula: 1/f = 1/v + 1/u',
            'Ohm\'s Law: V = I*R',
            'Magnification: m = -v/u = h\'/h'
          ],
          checklist: [
            { item: 'Ray Diagrams for Concave & Convex Mirrors', completed: true },
            { item: 'Resistors in Series & Parallel Numericals', completed: true },
            { item: 'Photosynthesis & Human Heart Diagram Revision', completed: false }
          ]
        }
      ];

      return res.json({
        success: true,
        exams,
        summary: {
          totalScheduled: exams.length,
          closestExamDays: exams[0].daysLeft,
          closestExamName: exams[0].name,
          overallReadiness: '82%'
        }
      });
    } catch (error) {
      console.error('[StudyPlanController] getExamSchedule error:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  }
}

module.exports = new StudyPlanController();
