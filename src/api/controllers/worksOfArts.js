const WorkOfArt = require('../models/api');
const data = require('../../../data.json')

const addWorksOfArts = async (req, res, next) => { 

     try {
          await WorkOfArt.insertMany(JSON.parse(data));
          return res.status(201).json('datos subidos a la BBDD')
          
     } catch (error) {

          return res.status(400).json(error);
          
     }


};

module.exports = { addWorksOfArts };