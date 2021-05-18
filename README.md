Netlify Screenshot
==================

Screenshot webpages to render social media cards on-the-fly using Puppeteer; largely based on [how Pieter generates shareable pictures](https://levels.io/phantomjs-social-media-share-pictures) for [Nomad List](https://nomadlist.com), and how Steve did it for [Coworkations](https://coworkations.com) with [cardserver](https://github.com/stevelacey/cardserver).

| [![Coworkations](https://coworkations.com/cards/coworkations.png)](https://coworkations.com/cards/coworkations.png) [📄 HTML](https://coworkations.com/cards/coworkations) [🖼️ PNG](https://coworkations.com/cards/coworkations.png) | [![Hacker Paradise: Cape Town South Africa](https://coworkations.com/cards/hacker-paradise/cape-town-south-africa.png)](https://coworkations.com/cards/hacker-paradise/cape-town-south-africa.png) [📄 HTML](https://coworkations.com/cards/hacker-paradise/cape-town-south-africa) [🖼️ PNG](https://coworkations.com/cards/hacker-paradise/cape-town-south-africa.png) |
| --: | --: |
| **[![Nomad Cruise VI: Spain To Greece](https://coworkations.com/cards/nomad-cruise/nomad-cruise-vi-spain-to-greece.png)](https://coworkations.com/cards/nomad-cruise/nomad-cruise-vi-spain-to-greece.png) [📄 HTML](https://coworkations.com/cards/nomad-cruise/nomad-cruise-vi-spain-to-greece) [🖼️ PNG](https://coworkations.com/cards/nomad-cruise/nomad-cruise-vi-spain-to-greece.png)** | **[![PACK: Ubud Bali](https://coworkations.com/cards/pack/ubud-bali-2.png)](https://coworkations.com/cards/pack/ubud-bali-2.png) [📄 HTML](https://coworkations.com/cards/pack/ubud-bali-2) [🖼️ PNG](https://coworkations.com/cards/pack/ubud-bali-2.png)** |


Setup
-----

After creating the site in Netlify, set the `BASE_URL` environment variable and it should be good to go, this is what gets prepended to the path when making requests to your web server:

```
https://{site-name}.netlify.app/.netlify/functions/screenshot/{path} -> {BASE_URL}/{path}
```

Environment variables can be set from `Site Settings > Build & deploy > Environment`, the value should be the root domain of your website e.g. `https://example.com`.


Usage
-----

Netlify Screenshot performs HTML requests based on PNG requests like so:

| 🖼 PNG (Netlify request) | 📄 HTML (webserver request) |
| :-------------------------------------------------- | :---------------------------------------------- |
| https://stevelacey.netlify.app/.netlify/functions/screenshot/cards/steve.png | https://steve.ly/cards/steve |
| https://coworkations.netlify.app/.netlify/functions/screenshot/cards/coworkations.png | https://coworkations.com/cards/coworkations |
| https://coworkations.netlify.app/.netlify/functions/screenshot/cards/hacker-paradise.png | https://coworkations.com/cards/hacker-paradise |
| https://coworkations.netlify.app/.netlify/functions/screenshot/cards/pack/ubud-bali-2.png | https://coworkations.com/cards/pack/ubud-bali-2 |

If you want to serve your cards on the same domain as your app, you can route PNG traffic to Netlify via NGINX:

```
location ~ ^/(cards/.*\.png)$ {
  proxy_pass http://{site-name}.netlify.app/.netlify/functions/screenshot/$1;
}
```

Then your URLs can look something like this:

| 🖼 PNG (Netlify request) | 📄 HTML (webserver request) |
| :-------------------------------------------------- | :---------------------------------------------- |
| https://steve.ly/cards/steve.png                    | https://steve.ly/cards/steve                    |
| https://coworkations.com/cards/coworkations.png     | https://coworkations.com/cards/coworkations     |
| https://coworkations.com/cards/hacker-paradise.png  | https://coworkations.com/cards/hacker-paradise  |
| https://coworkations.com/cards/pack/ubud-bali-2.png | https://coworkations.com/cards/pack/ubud-bali-2 |


Markup
------

You’ll want meta tags something like these:

```html
<meta itemprop="image" content="https://coworkations.com/cards/coworkations.png">
<meta property="og:image" content="https://coworkations.com/cards/coworkations.png">
<meta name="twitter:image" content="https://coworkations.com/cards/coworkations.png">
```


Debugging
---------

- [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug)
- [Twitter Card Validator](https://cards-dev.twitter.com/validator)
