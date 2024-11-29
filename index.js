const puppeteer = require('puppeteer');

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
     
    }
     
   
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
               await workOfArt.waitForSelector('img', { visible: true });
               image = await workOfArt.$eval('img', el => el.getAttribute('data-srcset'));
               
          } catch (error) {

               console.log('No se pudo obtener la imagen');
          }

          // Obtener el precio de la obra
          let price = '';
          try {
               price = await workOfArt.$eval('bdi', el => el.textContent.trim());
          } catch (error) {
               console.log('Consultar precio');
          }

          // Mostrar resultados
          console.log({
               artists, // Array de artistas
               title,
               image,
               price,
          });

     }

    

     // Cierra el navegador
     await browser.close();
};

scrapper('https://www.tallerdelprado.com/tienda/?v=04c19fa1e772');



