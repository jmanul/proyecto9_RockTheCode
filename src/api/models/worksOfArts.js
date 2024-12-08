
const mongoose = require('mongoose');

const worksOfArtschema = new mongoose.Schema({

     autor: { type: String, default:'sin autor', required: true,  trim: true },
     name: { type: String, required: true, trim: true },
     image: { type: String, required: true, trim: true },
     price: { type: Number, required: false, trim: true }
},

     {
          timestamps: true,
          collection: 'worksOfArts'
     });

// Campo virtual para la etiqueta del precio
worksOfArtschema.virtual('priceLabel').get(function () {
     return this.price === null ? "Consultar precio" : this.price;
});

// incluye campos virtuales en la respuesta
worksOfArtschema.set('toJSON', { virtuals: true });
worksOfArtschema.set('toObject', { virtuals: true });


const WorkOfArt = mongoose.model('worksOfArts', worksOfArtschema, 'worksOfArts');

module.exports = WorkOfArt;