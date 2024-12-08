
// añade informacion en algunos campos que aparecen vacios de origen, evita tener problemas al ser requeridos en el modelo y mejora la esperiencia de uso 

const addInfoProduts = (productsArray) => {

     return productsArray.map(product => ({
          ...product,
          name: product.name === '' ? 'sin titulo' : product.name,
          autor: product.autor === '' ? 'sin autor' : product.autor
     }));
};

module.exports = addInfoProduts;
