const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin');
const isAuth = require('../middlewares/is-auth');
const config = require('../config');
const aws = require("aws-sdk");
const multer = require("multer");
const multerS3 = require("multer-s3");

const s3 = new aws.S3({
  accessKeyId: config.AWS_ACCESS_KEY,
  secretAccessKey: config.AWS_SECRET_KEY,
});
  
const upload = multer({
  storage:multerS3({
    s3:s3,
    bucket: "meanstack2109",
    acl: 'public-read',
    metadata: function (req, file, cb) {
      cb(null, {
        fieldName: file.fieldname
      });
    },
    key: function (req, file, cb) {
      cb(null, Date.now().toString());
    },
  }),
})



router.get('/admin-products', isAuth, adminController.getAdminProducts);

router.post('/add-product',upload.single('imageUrl'),isAuth, adminController.postAddAdminProducts);

router.get('/:id/edit',isAuth, adminController.getSingleProduct);

router.post('/:id/edit',upload.single('imageUrl'),isAuth, adminController.postEditProduct);

router.post('/:id',isAuth, adminController.postDeleteProduct);

module.exports = router;