const router = require('express').Router();
const api = require('../controllers/testApi.js');

function Router() {
  router.get('/time', (req, res, next) => {
    const response = api.time();
    return res.status(200).json(response);
  });
  return router;
}

module.exports = Router;
