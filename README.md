# Pornhub API

## Installation

Via NPM:
```bash
$ npm i @bowwow/pornhub_api
```

## Import

You can do it in two ways:

```js
const PornHub = require('@bowwow/pornhub_api');
const ph = new PornHub();

ph.search({search:'porn'}).then(infos=>console.log(infos));
```

## Usage
* ### search(options) ⇒ <code>object</code>
it searches the pornhub database based on the options.

**Kind**: instance method of <code>PornHub</code>

| Param  | Type                | Description  |
| ------ | ------------------- | ------------ |
| options  | <code>object</code> | privacy gown |

#### Available options
| Name     | Type                                   | Description                           |
| ------    | -------------------                   | ------------                          |
| category  |<code>string</code>                     |   category                            |
| page      | <code>number</code>                    |   page                                |
| search    |<code>string </code>                          |   search keyword                      |
| phrase    |  <code>Array\<string\>\|string</code>  | pornstars                             |
| tags      | <code>Array\<string\> \|string</code>  | tags                                  |
| ordering  |<code>enum</code>                       | featured \| newest \| mostviewed \| rating  |
| period    |<code>enum</code>                       |   weekly \| monthly \| alltime            |
| thumbsize |<code>enum</code>                       | small \| medium \| large \| small_hd \| medium_hd \| large_hd  |


* ### filterJSON(searchResult) ⇒ <code>object</code>
it filters out useless properties from the search result.

**Kind**: instance method of <code>PornHub</code>

| Param  | Type                | Description  |
| ------ | ------------------- | ------------ |
| searchResult  | <code>object</code> | from the function search() |

* ### hasFLV(videoID) ⇒ <code>boolean</code>
it returns true if the video with the id has a flv link, return false otherewise.

**Kind**: instance method of <code>PornHub</code>

| Param  | Type                | Description  |
| ------ | ------------------- | ------------ |
| videoID  | <code>string</code> | id of the video |

* ### getFLV(videoID) ⇒ <code>string</code>
it returns the flv link of the video.

**Kind**: instance method of <code>PornHub</code>

| Param  | Type                | Description  |
| ------ | ------------------- | ------------ |
| videoID  | <code>string</code> | id of the video |
