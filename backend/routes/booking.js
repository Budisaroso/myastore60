const router = require('express').Router();
const controller = require('../controllers/bookingController');
const auth = require('../middleware/auth');

router.post('/', controller.buatBooking);
router.get('/cek/:nomor', controller.cekStatus);
router.get('/', auth, controller.semuaBooking);
router.get('/:id', auth, controller.detailBooking);
router.put('/:id/status', auth, controller.updateStatus);
router.delete('/:id', auth, controller.hapusBooking);

module.exports = router;