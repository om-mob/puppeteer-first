# Using Puppeteer

Tutorial: [Intro To Web Scraping With Puppeteer - Traversy Media (22m)](https://www.youtube.com/watch?v=S67gyqnYHmI)

scraped website: https://www.traversymedia.com/

puppeteer official page: https://pptr.dev/

---

## Steps

1. Create async function `async function run(url: string, dataPath: string)`
1. Create `puppeteer.Browser` Instance
   ```ts
   const browser = await puppeteer.launch();
   // Warning: Don't forget to close it `await browser.close()` at the end of the code
   ```
1. Create `puppeteer.Page` Instance
   ```ts
   const page = await browser.newPage();
   ```
1. navigate to url
   ```ts
   await page.goto(url);
   ```
1. Using `page.$$eval` method to scrape and create your json object. 
      [Documentations](https://pptr.dev/api/puppeteer.page.__eval/)
      
   This method runs `Array.from(document.querySelectorAll(selector))` within the page and passes the result as the first argument to the pageFunction.

   ```ts
   const selector = "#courses .card";
   const pageFunction: puppeteer.EvaluateFunc<[Element[]]> = (elements) => {
     const coursesObj = elements.map((el) => ({
       title: (el.querySelector(".card-body h3") as HTMLHeadingElement)
         .innerText,
       level: (el.querySelector(".card-body .level") as HTMLHeadingElement)
         .innerText,
       url: (el.querySelector(".card-footer a") as HTMLAnchorElement).href,
       promo: (
         el.querySelector(".card-footer .promo-code .promo") as HTMLSpanElement
       ).innerText,
     }));
     return JSON.stringify(coursesObj);
   };
   const coursesJson = (await page.$$eval(selector, pageFunction)) as string;
   ```

1. Export Data file `data.json`
   ```ts
   const dataDir = "../data";
   const dataFile = "data.json";
   const dataPath = dataDir + "/" + dataFile;
   ```
   1. create data dir
      ```ts
      if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir);
      ```
   1. write data file
      ```ts
      fs.writeFile(dataPath, coursesJson, (err) => {
        if (err) throw err;
        console.log(`File saved to ${dataPath}`);
      });
      ```
1. close `puppeteer.Browser` browser
   ```ts
   await browser.close();
   ```
---
## Run the program

```bash
git clone 'https://github.com/om-mob/puppeteer-first.git'
cd puppeteer-first
npm i
npm run dev
npm start
```
