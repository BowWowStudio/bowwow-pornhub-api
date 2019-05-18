import * as rp from "request-promise";
import { Builder, By, until, WebDriver } from "selenium-webdriver";
import * as chrome from "selenium-webdriver/chrome";
import { constants } from "http2";

declare interface searchOption {
  category?: string;
  page?: number;
  search?: string;
  phrase?: Array<string> | string; // pornstar
  tags?: Array<string> | string;
  ordering?: ordering;
  period?: period;
  thumbsize?: thumbSize;
}
declare interface videos {
  videos: Array<video>;
}
declare interface video {
  deration: string;
  views: number;
  video_id: string;
  rating: number;
  ratings: number;
  title: string;
  url: string;
  default_thumb: string;
  thumb: string;
  publish_date: Date;
  thumbs: Array<thumb>;
  tags: Array<tag>;
  pornstars: Array<pornstars>;
  categories: Array<category>;
  segment: string;
}
declare interface tag {
  tag_name: string;
}
declare interface thumb {
  size: string;
  width: number;
  height: number;
  src: string;
}
declare interface category {
  category: string;
}
declare interface pornstars {
  pornstar_name: string;
}
declare enum thumbSize {
  small = "small",
  medium = "medium",
  large = "large",
  small_hd = "small_hd",
  medium_hd = "medium_hd",
  large_hd = "large_hd"
}
declare enum period {
  weekly = "weekly",
  monthly = "monthly",
  alltime = "alltime"
}
declare enum ordering {
  featured = "featured",
  newest = "newest",
  mostviewed = "mostviewed",
  rating = "rating"
}

export default class PornHub {
  private readonly videoURL = "https://www.pornhub.com/view_video.php?viewkey=";
  private readonly videoSearchBaseURL =
    "http://www.pornhub.com/webmasters/search";
  private cacheVideo: Map<string, string> = new Map();
  constructor() {}
  search(option: searchOption): Promise<videos> {
    let returnPromise: Promise<videos> = new Promise<videos>(
      (resolve, reject) => {
        rp.get(this.buildSearchUrl(option))
          .then(value => resolve(JSON.parse(value)))
          .error(err => reject(err));
      }
    );
    return returnPromise;
  }
  filterJSON(infos: videos): object {
    let returnObject: videos = { ...infos };
    let videos: Array<video> = returnObject.videos;
    videos.forEach(video => {
      delete video.thumbs;
      delete video.tags;
      delete video.pornstars;
      delete video.categories;
    });
    return returnObject;
  }
  async hasFLV(videoID: string): Promise<boolean> {
    const flvStartURL = "phncdn.com";
    try {
      const videoSrc = await this.getVideoSource(videoID);
      if (typeof videoSrc !== 'undefined' && videoSrc.includes(flvStartURL)) {
        this.cacheVideo.set(videoID, videoSrc);
        return true;
      }
      return false;
    } catch (err) {
      throw err;
    }
  }
  async getFLV(videoID: string): Promise<string> {
    try {
      if (this.cacheVideo.has(videoID)) {
        return String(this.cacheVideo.get(videoID));
      }
      const videoSrc = await this.getVideoSource(videoID);
      this.cacheVideo.set(videoID, String(videoSrc));
      return String(videoSrc);
    } catch (err) {
      throw err;
    }
  }
  private async getVideoSource(videoID: string): Promise<string | undefined> {
    let driver: WebDriver | null = null;
    const flvStartURL = "phncdn.com";
    try {
      driver = await new Builder()
        .forBrowser("chrome")
        .setChromeOptions(
          new chrome.Options().headless().addArguments("log-level=3")
        )
        .build();
      const videoCSS = "div > video > source";
      const pay2download = 'div > div > div > span.pay2Download';
      const downloadTabCSS = '.video-actions-container >.video-actions-tabs >.download-tab >div.contentWrapper > a[target=_blank]';
      await driver.get(`${this.videoURL}${videoID}`);
      await driver.wait(until.elementLocated(By.css(videoCSS)), 10000);
      let downloadURL = await driver
        .findElement(By.css(videoCSS))
        .getAttribute("src");
      if(!downloadURL.includes(flvStartURL)){
        await driver.wait(until.elementLocated(By.css(pay2download)), 5000);
        const pay2downloadButton = await driver
        .findElement(By.css(pay2download));
        if(pay2downloadButton === null){
          await driver.wait(until.elementLocated(By.css(downloadTabCSS)), 5000);
          downloadURL = await driver
          .findElement(By.css(downloadTabCSS))
          .getAttribute('href');
        }
      }
      driver.quit();
      return downloadURL;
    } catch (err) {
      if (driver) {
        driver.quit();
      }
      return undefined;
    }
  }
  private buildSearchUrl(option: searchOption): string {
    let url = `${this.videoSearchBaseURL}?`;
    if (typeof option.category! === "string") {
      url += `&category=${option.category}`;
    }
    if (typeof option.page! === "number") {
      if (option.page >= 0) {
        url += `&page=${option.page}`;
      }
    }

    if (typeof option.search! === "string") {
      url += `&search=${option.search}`;
    }

    if (typeof option.phrase! === "string") {
      url += `&phrase[]=${option.phrase}`;
    } else if (option.phrase instanceof Array) {
      url += `&phrase[]=${option.phrase.join(",")}`;
    }

    if (typeof option.tags! === "string") {
      url += `&tags[]=${option.tags}`;
    } else if (option.tags instanceof Array) {
      url += `&tags[]=${option.tags.join(",")}`;
    }

    if (option.ordering) {
      url += `&ordering=${option.ordering}`;
    }

    if (option.period) {
      url += `&period=${option.period}`;
    }

    if (option.thumbsize) {
      url += `&thumbsize=${option.thumbsize}`;
    } else {
      url += `&thumbsize=small`;
    }

    return url;
  }
}

module.exports = PornHub;
