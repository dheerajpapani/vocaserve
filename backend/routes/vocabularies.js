// const express = require('express');
// const fs = require('fs');
// const path = require('path');
// const router = express.Router();

// const vocabDir = path.join(__dirname, '..', 'vocabularies');

// const {
//   getVocabularyById,
//   createVocabulary,
//   updateVocabulary,
//   deleteVocabulary
// } = require('../controllers/vocabController');

// // GET all vocabularies with pagination and search
// router.get('/', (req, res) => {
//   let { page = 1, limit = 10, search = '' } = req.query;
//   page = parseInt(page);
//   limit = parseInt(limit);
//   search = search.toLowerCase();

//   const files = fs.readdirSync(vocabDir).filter(f => f.endsWith('.json'));
//   let data = files.map(f => {
//     const content = JSON.parse(fs.readFileSync(path.join(vocabDir, f), 'utf-8'));
//     return {
//       id: path.basename(f, '.json'),
//       title: content.title,
//       description: content.description,
//       terms: content.terms || []
//     };
//   });

//   if (search) {
//     data = data.filter(v =>
//       v.title.toLowerCase().includes(search) ||
//       v.terms.some(t => t.toLowerCase().includes(search))
//     );
//   }

//   const total = data.length;
//   const start = (page - 1) * limit;
//   const pagedData = data.slice(start, start + limit);

//   res.json({ data: pagedData, total });
// });

// router.get('/:id', getVocabularyById);
// router.post('/', createVocabulary);
// router.put('/:id', updateVocabulary);
// router.delete('/:id', deleteVocabulary);

// // Fallback
// router.all('*', (req, res) => {
//   res.status(404).json({ error: 'Invalid route' });
// });

// module.exports = router;




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

