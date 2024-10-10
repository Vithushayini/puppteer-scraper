const puppeteer = require('puppeteer');
const express = require('express');

const app = express();
const port =3000;

app.get('/search', async (req, res) => {
    const keyword = req.query.keyword;

    if (!keyword) {
        return res.status(400).json({ error: 'Keyword query parameter is required' });
    }

    try {
        const data = await scrapeIkman(keyword);
        res.json(data);
    } catch (error) {
        console.error("API Error:", error);
        res.status(500).json({ error: 'Failed to scrape data', details: error.message });
    }
});

async function scrapeIkman(keyword) {

  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  try {
      const url = `https://ikman.lk/en/ads?query=${keyword}&page=1`;
      await page.goto(url, {
          // timeout: 60000,
          waitUntil: 'networkidle0'
      });

      const productData = await page.evaluate((url) => {
          // const product=Array.from(document.querySelectorAll('.card-link--3ssYv'))
          const data = Array.from(document.querySelectorAll('.card-link--3ssYv.gtm-ad-item')).map((product) => (
                  {
                      
                      title: product.querySelector('.heading--2eONR')?.innerText,
                      price: product.querySelector('.price--3SnqI')?.innerText,
                      location: product.querySelector('.description--2-ez3')?.innerText,
                      listing_URL: product?.href,
                      // listing_URL: product.getAttribute('href'),
                      date_posted: product.querySelector('.updated-time--1DbCk')?.innerText || 'Not found'
                  }
              ))
          return data;
      }, url)

      await browser.close();
      return productData;
  } catch (error) {
      return error.message;
  }

}
// async function scrapeIkman(keyword) {
//   const browser = await puppeteer.launch({headless:false})
//   const page = await browser.newPage()

//   try{
//     const url = `https://ikman.lk/en/ads?query=${keyword}&page=1`;
//     await page.goto(url, { waitUntil: 'networkidle2' });
//       const bookData = await page.evaluate((url)=>{
//         const bookPods = Array.from(document.querySelectorAll('.container--2uFyv'))
//         const data = bookPods.map((book)=>({
//         title: book.querySelector('.heading--2eONR').innerText,
//         price: book.querySelector('.price--3SnqI').innerText,
//         location: book.querySelector('.description--2-ez3').innerText,
//         // listing_URL: book.querySelector('a.card-link--3ssYv gtm-ad-item')?.getAttribute('href') || 'Not found',
//         // listing_URL: book.querySelector('a').getAttribute('href') || 'Not found',
//         date_posted: book.querySelector('.updated-time--1DbCk')?.innerText || 'Not found',
//         //   imgSrc: url + book.querySelector('img').getAttribute('src'),
//         //   rating: book.querySelector('.star-rating').classList[1]
//         }))

//         return data
//     },url)
//     console.log(bookData);
  
//   await browser.close()
//   return bookData;
// }catch (error) {
//     console.error('Error during scraping:', error);
//     return []; // Handle errors gracefully, consider returning an error object with details
//   }
// }

app.listen(port, () => console.log(`Server listening on port ${port}`));


// const url = 'https://ikman.lk/en/ads'

// const main = async ()=>{
//   const browser = await puppeteer.launch({headless:false})
//   const page = await browser.newPage()
//   await page.goto(url)

//   const bookData = await page.evaluate((url)=>{
//     const bookPods = Array.from(document.querySelectorAll('.container--2uFyv'))
//     const data = bookPods.map((book)=>({
//       title: book.querySelector('.heading--2eONR').innerText,
//       price: book.querySelector('.price--3SnqI').innerText,
//     //   imgSrc: url + book.querySelector('img').getAttribute('src'),
//     //   rating: book.querySelector('.star-rating').classList[1]
//     }))

//     return data
//   },url)
//   console.log(bookData);
  

  
//   await browser.close()
// }

// main()