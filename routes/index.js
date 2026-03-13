const express = require('express');
const router = express.Router();

/* GET página principal (Mapa) */
router.get('/', (req, res) => { 
	res.render('index') 
});

module.exports = router;