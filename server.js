const express = require('express');
const cors = require('cors');
const multer = require('multer');
const sharp = require('sharp');

const app = express();
app.use(cors());
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

app.get('/', (req, res) => res.json({ status: 'upload-api' }));

app.post('/api/chat/photo', upload.single('photo'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file' });
  try {
    const resized = await sharp(req.file.buffer)
      .resize(800, 800, { fit: 'inside' })
      .jpeg({ quality: 70 })
      .toBuffer();
    res.json({ success: true, url: `data:image/jpeg;base64,${resized.toString('base64')}` });
  } catch(e) {
    res.json({ success: true, url: `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}` });
  }
});

const PORT = process.env.PORT || 3005;
app.listen(PORT, () => console.log(`✅ UPLOAD:${PORT}`));
