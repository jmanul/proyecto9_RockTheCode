
const mongoose = require('mongoose');

const worksOfArtschema = new mongoose.Schema({

     name: { type: String, required: true, trim: true },
     autor: { type: String, required: true, trim: true },
     price: [{ type: Number, default: null, required: true, trim: true }],
     image: { type: String, requuired: true, trim: true }
},

     {
          timestamps: true,
          collection: 'worksOfArts'
     });


const WorkOfArt = mongoose.model('worksOfArts', worksOfArtschema, 'worksOfArts');

module.exports = WorkOfArt;