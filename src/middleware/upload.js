const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    let folder = 'hrms/misc';
    let resource_type = 'auto'; // automatically detect image/raw(document)

    if (file.mimetype.startsWith('image/')) {
        folder = 'hrms/images';
    } else if (file.mimetype === 'application/pdf' || file.mimetype.includes('document') || file.mimetype.includes('msword')) {
        folder = 'hrms/documents';
    }

    return {
      folder: folder,
      resource_type: resource_type
    };
  },
});

const upload = multer({ storage: storage });

module.exports = upload;
