const express = require('express');
const router = express.Router();
const {
  getAllVocabularies,
  getVocabularyById,
  createVocabulary,
  updateVocabulary,
  deleteVocabulary
} = require('../controllers/vocabController');

router.get('/', getAllVocabularies);
router.get('/:id', getVocabularyById);
router.post('/', createVocabulary);
router.put('/:id', updateVocabulary);
router.delete('/:id', deleteVocabulary);

module.exports = router;

