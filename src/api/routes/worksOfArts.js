
const { addWorksOfArts, getWorksOfArts } = require('../controllers/worksOfArts');


const worksOfArtsRouter = require('express').Router();

worksOfArtsRouter.post('/add', addWorksOfArts);
worksOfArtsRouter.get('/', getWorksOfArts);



module.exports = worksOfArtsRouter;