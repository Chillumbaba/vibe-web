import express from 'express';
import { auth } from '../middleware/auth';
import { Habit } from '../models/Habit';

const router = express.Router();

// Get user's habit data
router.get('/', auth, async (req, res) => {
  try {
    const habit = await Habit.findOne({ userId: req.user._id });
    if (!habit) {
      return res.status(404).json({ message: 'No habit data found' });
    }
    res.json(habit);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching habit data' });
  }
});

// Create or update rules
router.post('/rules', auth, async (req, res) => {
  try {
    const { rules } = req.body;
    let habit = await Habit.findOne({ userId: req.user._id });

    if (!habit) {
      habit = new Habit({
        userId: req.user._id,
        rules,
        entries: []
      });
    } else {
      habit.rules = rules;
    }

    await habit.save();
    res.json(habit);
  } catch (error) {
    res.status(400).json({ message: 'Error updating rules' });
  }
});

// Add or update entry
router.post('/entries', auth, async (req, res) => {
  try {
    const { date, values } = req.body;
    let habit = await Habit.findOne({ userId: req.user._id });

    if (!habit) {
      return res.status(404).json({ message: 'No habit data found' });
    }

    const existingEntryIndex = habit.entries.findIndex(
      entry => entry.date.toISOString().split('T')[0] === date
    );

    if (existingEntryIndex !== -1) {
      habit.entries[existingEntryIndex].values = values;
    } else {
      habit.entries.push({ date: new Date(date), values });
    }

    // Sort entries by date
    habit.entries.sort((a, b) => a.date.getTime() - b.date.getTime());

    await habit.save();
    res.json(habit);
  } catch (error) {
    res.status(400).json({ message: 'Error updating entry' });
  }
});

// Get stats for a time period
router.get('/stats', auth, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const habit = await Habit.findOne({ userId: req.user._id });

    if (!habit) {
      return res.status(404).json({ message: 'No habit data found' });
    }

    const filteredEntries = habit.entries.filter(entry => {
      const entryDate = entry.date.getTime();
      return (!startDate || entryDate >= new Date(startDate as string).getTime()) &&
             (!endDate || entryDate <= new Date(endDate as string).getTime());
    });

    const stats = habit.rules.map((rule, index) => {
      const values = filteredEntries.map(entry => entry.values[index]);
      const ticks = values.filter(v => v === '✓').length;
      const crosses = values.filter(v => v === '✗').length;
      const total = values.length;

      return {
        ruleName: rule.name,
        ticks,
        crosses,
        completion: total ? Math.round((ticks + crosses) / total * 100) : 0,
        successRate: (ticks + crosses) ? Math.round(ticks / (ticks + crosses) * 100) : 0,
        crossRate: total ? Math.round(crosses / total * 100) : 0
      };
    });

    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: 'Error calculating stats' });
  }
});

export const habitRouter = router; 