
const puppeteer = require('puppeteer');
const fs = require('fs');

const workOfArtsArray = [];
let numberPage = 1;

const scrapper = async (url) => {
     console.log(url);

     const browser = await puppeteer.launch({ headless: false });
     const page = await browser.newPage();
     await page.goto(url);
     await page.setViewport({ width: 1024, height: 600})

     try {
          await page.waitForSelector('#wt-cli-accept-all-btn', { visible: true });
          const cookieButton = await page.$(`#wt-cli-accept-all-btn`);
          await cookieButton.click();
          console.log('Cookies aceptadas');

     } catch (error) {
          console.log('no hay Cookies');
     }
     
     await createItems(page, workOfArtsArray, browser);
}

const createItems = async (page, array, browser) => {

     await delay(5000);

     // Recoge los elementos de la página actual

     await page.waitForSelector('li.infinite-scroll-item', { visible: true });

     const arrayArt = await page.$$('li.infinite-scroll-item');

     // recorre los elementos y estrae las propiedades

     for (const workOfArt of arrayArt) {


          let autor = '';
          try {
               autor = await workOfArt.$eval('span.artist-name-shop', el => el.textContent.trim());
          } catch (error) {
               console.log('no hay autor');
          }

          let name = '';
          try {
               name = await workOfArt.$eval('h2.woocommerce-loop-product__title', el => el.textContent.trim());
          } catch (error) {
               console.log('no hay nombre de la obra');
          }

          // las imagenes las estraemos de este modo ya que con ($eval) directamente me arroja resultados de src con una URL en blanco o placeholder

          let image = '';

           try {
               // verifica si existe el atributo 'data-src'
               const dataSrc = await workOfArt.$eval('img', el => el.hasAttribute('data-src'));

               if (dataSrc) {

                    // si existe, obtener el valor
                    image = await workOfArt.$eval('img', el => el.getAttribute('data-src'));
                    console.log(`data-src --> ${image}`);
               } else {
                    // si no existe, usa el 'srcset' para obtener la URL
                    const srcset = await workOfArt.$eval('img', el => el.getAttribute('srcset'));
                    if (srcset) {
                         // limpia y elige la ultima URL del 'srcset' como la más grande
                         const urls = srcset.split(',').map(item => item.trim().split(' ')[0]);
                         image = urls[urls.length - 1];

                         console.log(`srcset --> ${image}`);
                    } else {
                         // si tampoco hay 'srcset', usa el 'src'
                         image = await workOfArt.$eval('img', el => el.getAttribute('src'));
                         console.log(`src --> ${image}`);
                    }
                    
               }
           } catch (error) {
                
               console.log('no hay imagen:', error);
          }

          // se trata el precio para dejar un valor numerico valido
          let price = '';
          try {
               price = await workOfArt.$eval('span.price', el => el.textContent);
               price = parseFloat(price.replace(/\./g, '').replace(',', '.').replace(/[^\d.-]/g, ''));

          } catch (error) {
               console.log('no hay precio');
          }

          // se crea un objeto con los valores de cada elemento
          const workOfArtItem = {
               autor,
               name,
               image,
               price
          };
          array.push(workOfArtItem);

     }

     // comprueba si el botón con el numero de la siguiente pagina existe y hace click (acerlo sobre el boton de next no funciona como se espera y realiza falsas cargas de pagina)

     try {

          const isNextButtonPage = await page.$(`[data-page="${numberPage + 1}"]`);
          await isNextButtonPage.click();

          //(waitForNavigation) no funciona en esta web ya que se hace una carga dinamica del contenido

          console.log(`Pasamos a la página ${numberPage + 1} con ${array.length} elementos`);

          numberPage++;
          // procesa la siguiente página
          await createItems(page, array, browser);


     } catch (error) {

          console.log('No hay más páginas');
          await dateWrite(array);
          await browser.close();

     }

}

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const dateWrite = (array) => {

     fs.writeFile('data.json', JSON.stringify(array, null, 2), () => {
          console.log(`Archivo escrito de ${numberPage} paginas con ${array.length} elementos`);
     });
}

scrapper('https://www.tallerdelprado.com/tienda/?v=12470fe406d4');











