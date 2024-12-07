const mongoose = require('mongoose');


const dbConect = async () => {

     try {
          await mongoose.connect(process.env.DB_URL);
          console.log('DDBB conectada 🤖🤖');

     } catch (error) {
          
          console.log('no se pudo conectar a la base de datos');
     }
};

module.exports = { dbConect };