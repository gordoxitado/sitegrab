const { buffer } = require('micro');
const formidable = require('formidable');
const { v4: uuidv4 } = require('uuid');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const form = new formidable.IncomingForm();
    form.uploadDir = '/tmp';
    form.keepExtensions = true;

    const [fields, files] = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        resolve([fields, files]);
      });
    });

    const file = files.file;
    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Aqui você pode implementar o upload para um serviço de armazenamento
    // como S3, Cloudinary, etc. Por enquanto, simularemos uma URL
    const fileId = uuidv4();
    const fileName = file.originalFilename || 'file';
    const fileExt = fileName.split('.').pop();
    
    // Na versão final, esta URL deve apontar para seu serviço de armazenamento
    const downloadUrl = `${process.env.VERCEL_URL || 'http://localhost:3000'}/files/${fileId}.${fileExt}`;

    res.json({
      url: downloadUrl,
      name: fileName,
      size: file.size
    });

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Error processing upload' });
  }
};