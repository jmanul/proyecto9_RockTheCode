const puppeteer = require('puppeteer');
const fs = require('fs');

const workOfArtsArray = [];

const scrapper = async (url) => {

     console.log(url);

     const browser = await puppeteer.launch({ headless: false });
     const page = await browser.newPage();
     await page.goto(url);

     try {
        
          await page.waitForSelector('#wt-cli-accept-all-btn', { visible: true });
          const cookieButton = await page.$('#wt-cli-accept-all-btn');

          await cookieButton.click();

          console.log('Cookies aceptados');

     } catch (error) {
         
          console.log('No hay Cookies');     

     };

     createItem(page, workOfArtsArray, browser);
     
}

const createItem = async (page, array, browser) => {

     await page.waitForSelector('.facetwp-pager', { visible: true });
     await page.waitForSelector('.infinite-scroll-item', { visible: true });

     const arrayArt = await page.$$('.infinite-scroll-item');



     for (const workOfArt of arrayArt) {


          // Obtener todos los autores como un array

          let artists = [];
          try {
               artists = await workOfArt.$$eval('.artist-name-shop', artist => artist.map(el => el.textContent.trim())
               );
          } catch (error) {
               console.log('No se encontraron autores');
          }

          // Obtener el nombre de la obra
          let title = '';
          try {
               title = await workOfArt.$eval('h2', el => el.textContent.trim());
          } catch (error) {
               console.log('No se encontró el nombre de la obra');
          }

          // Obtener la URL de la imagen
          let image = '';
          try {
               image = await workOfArt.$eval('img', el => el.getAttribute('data-srcset'));

          } catch (error) {

               console.log('No se pudo obtener la imagen');
          }

          // Obtener el precio de la obra
          let price = '';
          try {
               price = await workOfArt.$eval('bdi', el => el.textContent);

               // Limpiar el valor del precio
               price = parseFloat(
                    price
                         .replace(/\./g, '') // Eliminar puntos (separadores de miles)
                         .replace(',', '.') // Reemplazar coma (separador decimal) por un punto
                         .replace(/[^\d.-]/g, '')); // Eliminar símbolos no numéricos (como €)
          } catch (error) {

               price = 'Consultar precio';
          }

          let workOfArtItem = {

               artists, // Array de obras de arte
               title,
               image,
               price,
          };

          array.push(workOfArtItem);

     }


     try {

          await page.waitForSelector('[aria-label="Go to next page"]', { visible: true });
          const nextPageButton = await page.$('[aria-label="Go to next page"]');

          await nextPageButton.click();

          console.log('pasamos a la siguiente pagina');

          createItem(page, workOfArtsArray, browser);

     } catch (error) {

          console.log('No hay mas paginas');
          // Cierra el navegador
          await browser.close();
          dateWrite(workOfArtsArray);

     }

     console.log(array.length);


};


const dateWrite = (array) => {

     fs.writeFile('workOfArts.json', JSON.stringify(array), () => {

          console.log('archivo escrito');
     })
}

scrapper('https://www.tallerdelprado.com/tienda/?v=04c19fa1e772');







