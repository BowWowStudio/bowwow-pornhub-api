import * as cheerio from 'cheerio';
const https = require('follow-redirects').https;
import * as url from 'url';
import * as rp from 'request-promise';
import {
    Builder,
    By,
    until,
    WebDriver,
} from "selenium-webdriver";
import * as chrome from "selenium-webdriver/chrome";
import { Driver } from 'selenium-webdriver/edge';

export interface searchOption {
    category ? : string,
        page ? : number,
        search ? : string,
        phrase ? : Array < string > | string, // pornstar
        tags ? : Array < string > | string,
        ordering ? : ordering,
        period ? : period
    thumbsize ? : thumbSize
}
export enum thumbSize {
    small = 'small',
        medium = 'medium',
        large = 'large',
        small_hd = 'small_hd',
        medium_hd = 'medium_hd',
        large_hd = 'large_hd',
}
export enum period {
    weekly = 'weekly',
        monthly = 'monthly',
        alltime = 'alltime',
}
export enum ordering {
    featured = 'featured',
        newest = 'newest',
        mostviewed = 'mostviewed',
        rating = 'rating',
}

export class PornHub {
    private readonly videoURL = 'https://www.pornhub.com/view_video.php?viewkey='
    private readonly videoSearchBaseURL = 'http://www.pornhub.com/webmasters/search';
    private cacheVideo:Map<string,string> = new Map();
    constructor() {}
    search(option: searchOption): Promise < object > {
        let returnPromise: Promise < object > = new Promise < object > ((resolve, reject) => {
            rp.get(this.buildSearchUrl(option))
                .then(value => resolve(JSON.parse(value)))
                .error(err => reject(err));
        })
        return returnPromise;
    }
    filterJSON(infos: object): object {
        let returnObject:object = {...infos};
        let videos:Array<object> = returnObject['videos'];
        videos.forEach(video=>{
            delete video['thumbs'];
            delete video['tags'];
            delete video['pornstars'];
            delete video['categories'];
        })
        return returnObject;
    }
    async hasFLV(videoID: string): Promise < boolean > {
        try{
            const videoSrc = await this.getVideoSource(videoID);
            if(typeof videoSrc !== 'undefined'){
                this.cacheVideo.set(videoID,videoSrc);
                return true;
            }
            return false; 
        }
        catch(err){
            throw err;
        }
    }
    async getFLV(videoID: string): Promise < string > {
        try{
            if(this.cacheVideo.has(videoID)){
                return this.cacheVideo.get(videoID);
            }
            const videoSrc = await this.getVideoSource(videoID);
            this.cacheVideo.set(videoID,videoSrc);
            return String(videoSrc);
        }
        catch(err){
            throw err;
        }
    }
    private async getVideoSource(videoID: string): Promise < string|undefined > {
        let driver:WebDriver;
        try {
            driver = await new Builder().forBrowser("chrome")
                .setChromeOptions(new chrome.Options().headless()
                .addArguments("log-level=3")).build();
            const videoCSS = 'div > video > source';
            await driver.get(`${this.videoURL}${videoID}`);
            await driver.wait(until.elementLocated(By.css(videoCSS)), 10000);
            const downloadURL = await driver.findElement(By.css(videoCSS)).getAttribute("src");
            console.log(downloadURL);
            driver.quit();
            return downloadURL;
        } catch (err) {
            console.error(err);
            throw err;
        } finally{
            if(driver){
                driver.quit();
            }
        }
    }
    private buildSearchUrl(option: searchOption): string {
        let url = `${this.videoSearchBaseURL}?`;
        if (typeof option.category! === 'string') {
            url += `&category=${option.category}`
        }
        if (typeof option.page! === 'number') {
            if (option.page >= 0) {
                url += `&page=${option.page}`
            }
        }

        if (typeof option.search! === 'string') {
            url += `&search=${option.search}`
        }

        if (typeof option.phrase! === 'string') {
            url += `&phrase[]=${option.phrase}`
        } else if (option.phrase instanceof Array) {
            url += `&phrase[]=${option.phrase.join(",")}`
        }

        if (typeof option.tags! === 'string') {
            url += `&tags[]=${option.tags}`
        } else if (option.tags instanceof Array) {
            url += `&tags[]=${option.tags.join(",")}`
        }

        if (option.ordering) {
            url += `&ordering=${option.ordering}`
        }

        if (option.period) {
            url += `&period=${option.period}`
        }

        if (option.thumbsize) {
            url += `&thumbsize=${option.thumbsize}`
        } else {
            url += `&thumbsize=small`
        }

        return url
    }
}