
const products = require('../../../products.json');
const addInfoProduts = require('../../utils/addInfoProducts');
const WorkOfArt = require('../models/worksOfArts');



const addWorksOfArts = async (req, res, next) => {

     const productsVerified = addInfoProduts(products);

     try {
          
          // limpia la BBDD de datos para avitar resubir datos ya subidos
          await WorkOfArt.deleteMany({});
          console.log('datos antiguos eliminados');
          
          await WorkOfArt.insertMany(productsVerified);
          return res.status(201).json(`${productsVerified.length} obras de arte insertadas en la BBDD`)
          
     } catch (error) {

          res.status(500).json({ error: 'error al insertar las obras de arte', details: error.message });
          
     }

};

const getWorksOfArts = async (req, res, next) => {

     try {
          const workOfArts = await WorkOfArt.find()
     
          res.status(200).json(workOfArts);

     } catch (error) {
          res.status(500).json({ error: 'error al obtener las obras de arte', details: error.message });
     }
}


module.exports = { addWorksOfArts, getWorksOfArts};