const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const Airport = require('../models/airports');
const flash = require('connect-flash')
const { isloggedin, iscreator, validateairport } = require('../middleware')
const multer  = require('multer')
const { storage } = require('../cloudinary')
const upload = multer({storage})

const airports = require('../controllers/airports')

router.route('/')
    .get(catchAsync(airports.index))
    .post( isloggedin, upload.array('image'),validateairport, catchAsync(airports.newairport))
 

router.get('/new', isloggedin, airports.newform)

router.route('/:id')
    .get(catchAsync(airports.airportdetails))
    .put(isloggedin, iscreator,upload.array('image'), catchAsync(airports.editairport))
    .delete(isloggedin, iscreator, catchAsync(airports.deleteairport))

router.get('/:id/edit', isloggedin, iscreator, catchAsync(airports.editform))

module.exports = router;
