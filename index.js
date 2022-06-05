const puppeteer = require("puppeteer");
const fs = require("fs/promises");
const express = require("express");
const app = express();

const port = 5000;
app.listen(port, () => {
  console.log("listening on Port " + port);
});

//server is ready so when we make req with below api

app.get("/", async (req, res) => {
  try {
    //localhost:5000?location=Chinatown Complex - 335 Smith St, Singapore, 050335
    let location = req.query.location;
    if (location) {
      start(location);
    }
  } catch (err) {
    return res.status(400).send({ message: err.message });
  }
});

async function start(location) {
  const browser = await puppeteer.launch({
    headless: false,
    args: ["--proxy-server=83.77.118.53:17171"],
  });
  /*
now server is completed but its
creating an error
*/
  const page = await browser.newPage();

  const webUrl = "https://food.grab.com";

  page.on("response", async (res) => {
    //the data we can recieve here if browser make any requests
    //we need to apply some logic to get longitude and latitue
    console.log(await res._request._resourceType);

    // we need to send the res that key word is search contain this type of data

    // now we need to make some simple logic to collect latitude and longitude
    return res.status(200).send({ data: res._request._resourceType });
  });
  await page.goto(webUrl);
  await page.screenshot({ path: "amazing.png", fullPage: true });

  //here page.type set the location with api location
  await page.type("#location-input", location);

  //here search button is fired
  await page.click(".ant-btn");

  //here we are wating to full fill
  await Promise.all([page.click(".ant-btn button"), page.waitForNavigation()]);
  //when promis got full fill it return the data from line event emiiter that is set above page.on res
  //here we close the data
  await browser.close();
}
