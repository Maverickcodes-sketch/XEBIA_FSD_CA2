const Feedback = require('../models/Feedback');
let nextFeedbackId = 1;

// POST 
exports.createFeedback = async (req, res, next) => {
  try {
    const { studentName, courseName, message, rating } = req.body;

    const feedback = await Feedback.create({
      id: nextFeedbackId++,
      studentName,
      courseName,
      message,
      rating,
    });

    return res.status(201).json({
      success: true,
      message: 'Feedback submitted successfully',
      data: feedback,
    });
  } catch (err) {
    next(err);
  }
};

// GET
exports.getFeedback = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;

    if (page < 1 || limit < 1) {
      return res.status(400).json({
        success: false,
        message: 'page and limit must be positive integers',
      });
    }

    const skip = (page - 1) * limit;

    const [feedback, totalRecords] = await Promise.all([
      Feedback.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
      Feedback.countDocuments(),
    ]);

    return res.status(200).json({
      success: true,
      currentPage: page,
      limit,
      totalRecords,
      totalPages: Math.ceil(totalRecords / limit),
      count: feedback.length,
      data: feedback,
    });
  } catch (err) {
    next(err);
  }
};

//PATCH
exports.updateFeedbackStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const numericId = Number(id);

    if (!Number.isInteger(numericId) || numericId < 1) {
      return res.status(400).json({
        success: false,
        message: 'Feedback ID must be a positive integer',
      });
    }

    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'status is required in the request body',
      });
    }

    const updated = await Feedback.findOneAndUpdate(
      { id: numericId },
      { status },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: 'Feedback record not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Feedback status updated successfully',
      data: updated,
    });
  } catch (err) {
    next(err);
  }
};
