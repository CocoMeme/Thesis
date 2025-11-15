const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();

// Import controller functions
const {
  getPollinations,
  getPollination,
  createPollination,
  updatePollination,
  deletePollination,
  addImage,
  deleteImage,
  addNote,
  markFlowering,
  markPollinated,
  getPlantsNeedingAttention,
  getUpcomingPollinations,
  getPlantTypes,
  getDashboardStats
} = require('../controllers/pollinationController');

// Import middleware
const { authenticate } = require('../middleware/auth');
const { validatePollination, validateNote } = require('../middleware/validation');

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'uploads/pollination/');
  },
  filename: function(req, file, cb) {
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`);
  }
});

const fileFilter = (req, file, cb) => {
  // Check file type
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed'), false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: fileFilter
});

// Public routes
router.get('/plant-types', getPlantTypes);

// Protected routes - require authentication
router.use(authenticate);

// Special functionality routes (must be before /:id routes)
router.get('/dashboard/stats', getDashboardStats);
router.get('/attention/needed', getPlantsNeedingAttention);
router.get('/upcoming/pollinations', getUpcomingPollinations);

// Main CRUD routes
router.route('/')
  .get(getPollinations)
  .post(validatePollination, createPollination);

router.route('/:id')
  .get(getPollination)
  .put(updatePollination)
  .delete(deletePollination);

// Image management routes
router.post('/:id/images', upload.single('image'), addImage);
// @route   DELETE /api/pollination/:id/images
// @access  Private
router.delete('/:id/images', authenticate, deleteImage);

// Note management routes
router.post('/:id/notes', validateNote, addNote);

// Plant lifecycle management routes
router.post('/:id/flowering', markFlowering);
router.post('/:id/pollinate', markPollinated);

// Error handling middleware for multer
router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File size too large. Maximum size is 10MB.'
      });
    }
  }
  
  if (error.message === 'Only image files are allowed') {
    return res.status(400).json({
      success: false,
      message: 'Only image files are allowed'
    });
  }
  
  next(error);
});

module.exports = router;