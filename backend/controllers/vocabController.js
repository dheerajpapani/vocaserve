const fs = require('fs');
const path = require('path');

const vocabDir = path.join(__dirname, '..', 'vocabularies');

function findFilePath(id) {
  const jsonPath = path.join(vocabDir, `${id}.json`);
  const jsonldPath = path.join(vocabDir, `${id}.jsonld`);
  if (fs.existsSync(jsonPath)) return jsonPath;
  if (fs.existsSync(jsonldPath)) return jsonldPath;
  return null;
}

// GET /vocabularies
exports.getAllVocabularies = (req, res) => {
  const { page = 1, limit = 10, search = '' } = req.query;
  let files = fs.readdirSync(vocabDir).filter(f => f.endsWith('.json') || f.endsWith('.jsonld'));

  let list = files.map(file => {
    const filepath = path.join(vocabDir, file);
    const raw = JSON.parse(fs.readFileSync(filepath, 'utf-8'));
    const id = path.basename(file, path.extname(file));

    if (file.endsWith('.jsonld')) {
      const title = raw.prefLabel || raw['skos:prefLabel'] || 'Untitled JSON-LD';
      const terms = raw.hasTopConcept?.[0]?.narrower?.map(t => t.prefLabel) || [];
      return { id, title, description: 'From JSON-LD SKOS', terms };
    } else {
      return {
        id,
        title: raw.title || 'Untitled JSON',
        description: raw.description || '',
        terms: raw.terms || []
      };
    }
  });

  // Apply search filtering
  const searchLower = search.toLowerCase();
  if (searchLower) {
    list = list.filter(v =>
      v.title.toLowerCase().includes(searchLower) ||
      v.terms.some(t => t.toLowerCase().includes(searchLower))
    );
  }

  const total = list.length;
  const start = (page - 1) * limit;
  const paginated = list.slice(start, start + Number(limit));

  res.json({ data: paginated, total });
};

// GET /vocabularies/:id
exports.getVocabularyById = (req, res) => {
  const id = req.params.id;
  const filePath = findFilePath(id);
  if (!filePath) {
    return res.status(404).json({ error: `Vocabulary '${id}' not found` });
  }

  try {
    const data = fs.readFileSync(filePath, 'utf-8');
    const vocab = JSON.parse(data);

    if (filePath.endsWith('.jsonld')) {
      const simplified = {
        title: vocab.prefLabel || vocab['skos:prefLabel'] || 'Untitled JSON-LD',
        description: 'From JSON-LD SKOS',
        terms: []
      };

      const topConcepts = vocab.hasTopConcept?.[0]?.narrower || [];
      topConcepts.forEach(termObj => {
        simplified.terms.push({
          term: termObj.prefLabel,
          definition: termObj.definition || ''
        });
      });

      return res.json({ id, ...simplified });
    }

    return res.json({ id, ...vocab });

  } catch (err) {
    console.error(`Error loading vocabulary '${id}':`, err);
    return res.status(500).json({ error: 'Failed to load vocabulary' });
  }
};

// POST /vocabularies
exports.createVocabulary = (req, res) => {
  const { id, content } = req.body;

  if (!id || !content || typeof content !== 'object') {
    return res.status(400).json({ error: 'ID and valid JSON content required' });
  }

  const jsonPath = path.join(vocabDir, `${id}.json`);
  const jsonldPath = path.join(vocabDir, `${id}.jsonld`);
  if (fs.existsSync(jsonPath) || fs.existsSync(jsonldPath)) {
    return res.status(409).json({ error: 'Vocabulary already exists' });
  }

  try {
    fs.writeFileSync(jsonldPath, JSON.stringify(content, null, 2), 'utf-8');
    return res.status(201).json({ id, ...content });
  } catch (err) {
    console.error(`Error writing vocabulary '${id}':`, err);
    return res.status(500).json({ error: 'Failed to save vocabulary' });
  }
};

// PUT /vocabularies/:id
exports.updateVocabulary = (req, res) => {
  const { id } = req.params;
  const filePath = findFilePath(id);

  if (!filePath) {
    return res.status(404).json({ error: 'Vocabulary not found' });
  }

  const { content } = req.body;
  if (!content || typeof content !== 'object') {
    return res.status(400).json({ error: 'Valid JSON content required' });
  }

  try {
    fs.writeFileSync(filePath, JSON.stringify(content, null, 2), 'utf-8');
    return res.json({ id, ...content });
  } catch (err) {
    console.error(`Error updating vocabulary '${id}':`, err);
    return res.status(500).json({ error: 'Failed to update vocabulary' });
  }
};

// DELETE /vocabularies/:id
exports.deleteVocabulary = (req, res) => {
  const { id } = req.params;
  const filePath = findFilePath(id);
  if (!filePath) {
    return res.status(404).json({ error: 'Vocabulary not found' });
  }

  try {
    fs.unlinkSync(filePath);
    return res.json({ message: 'Vocabulary deleted successfully' });
  } catch (err) {
    console.error(`Error deleting vocabulary '${id}':`, err);
    return res.status(500).json({ error: 'Failed to delete vocabulary' });
  }
};
