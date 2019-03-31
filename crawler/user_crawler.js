const puppeteer = require('puppeteer');
const moment = require('moment');

class UserCrawler {
  constructor(username) {
    this.username = username
  }

  async crawl() {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    await page.setDefaultNavigationTimeout(60000)
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle0'}),
      page.goto(`https://instagram.com/${this.username}`)
    ])
    let followers = await page.$('#react-root > section > main > div > header > section > ul > li:nth-child(2) > a > span')
    if (followers == null) {
      await browser.close()
      return {error: "User not found"}
    } else {
      const followersCount = await page.evaluate(el => el.title, followers);
      let following = await page.$("#react-root > section > main > div > header > section > ul > li:nth-child(3) > a > span")
      const followingCount = await page.evaluate(el => el.innerText, following);
      let time = moment().format('MMMM Do YYYY, h:mm a')
      await browser.close()
      return {error: "", stats: {timestamp: time, followersCount: parseInt(followersCount.replace(/,/g, '')), followingCount: parseInt(followingCount.replace(/,/g, ''))}}
    }



  }
}

module.exports = UserCrawler
