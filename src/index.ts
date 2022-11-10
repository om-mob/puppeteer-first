import puppeteer from "puppeteer";
import fs from "fs";
import path from "path";

async function run(url: string, dataPath: string) {
  const browser = await puppeteer.launch(); // init browser
  const page = await browser.newPage(); // init page
  await page.goto(url); // navigate to url

  /* take screenshot */
  const outputDir = path.join(process.cwd(), "screenshots");
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir); // create screenshot path
  // await page.screenshot({ path: `${outputDir}/example.png`, fullPage: true });
  /* save pdf */
  // await page.pdf({ path: `${outputDir}/example.pdf`, format: "A4" });

  /* HTML Content */
  // const html = await page.content()
  // console.log(html)

  /*** scrape all courses in the page and save it to JSON string***/
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
  const coursesJson = await page.$$eval(selector, pageFunction) as string;

  /*** Export Data file (courses.json) ***/
  const coursesPathArr = dataPath.split("\\");
  coursesPathArr.splice(coursesPathArr.length - 1, 1);
  const coursesDir = coursesPathArr.join("\\");

  // create data dir
  if (!fs.existsSync(coursesDir)) fs.mkdirSync(coursesDir);
  // write data file
  fs.writeFile(dataPath, coursesJson, (err) => {
    if (err) throw err;
    console.log(`File saved to ${dataPath}`);
  });

  await browser.close();
}

const URL = "https://www.traversymedia.com";
const dataPath = path.join(process.cwd(), "data", "courses.json");

run(URL, dataPath);
