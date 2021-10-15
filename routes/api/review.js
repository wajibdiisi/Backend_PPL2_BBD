const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const key = require('../../config/key').secret;
const passport = require('passport');
const User = require('../../model/User');



module.exports = router;
