var express = require('express');
var router = express.Router();
const controller = require('../controller/users');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource narutwo');
});

router.post('/login',controller.login);

router.get('/price-check/:productcode',controller.priceChecks);

router.get('/get-productcode/:barcode',controller.getProductCode);

router.get('/get-product-location/:productcode',controller.getProductLocation);

router.post('/get-product-byname',controller.getProductByName);

module.exports = router;
