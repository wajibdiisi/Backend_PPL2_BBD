const express = require('express');
const router = express.Router();
const Indonesia = require('../../model/IndonesiaProvince');

router.get('/provinsi', async (req, res) => {
    const provinces = await Indonesia.getAllProvince()
    res.send(provinces)
}),
router.get('/provinsi/:id', async (req, res) => {
    const provinces = await Indonesia.getProvincebyName(req.params.id)

    res.send(provinces[0].regencies)
}),

module.exports = router;
