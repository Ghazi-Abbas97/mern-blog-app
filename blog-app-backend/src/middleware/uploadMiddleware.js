const path = require('path');
const multer = require('multer');

// 1) Configure storage: where & how files are saved
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../../public/uploads')); 
    // Make sure `uploads/` folder exists at project root
  },
  filename: function (req, file, cb) {
    // e.g. image-1632423423.jpg
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

// 2) Filter to only images
function fileFilter(req, file, cb) {
  if (!file.mimetype.startsWith('image/')) {
    return cb(new Error('Only image files are allowed!'), false);
  }
  cb(null, true);
}

// 3) Export the middleware
const upload = multer({ storage, fileFilter });
module.exports = upload;
