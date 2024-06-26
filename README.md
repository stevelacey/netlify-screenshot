Netlify Screenshot
==================

Screenshot webpages to render social media cards on-the-fly using Puppeteer; largely based on [how Pieter generates shareable pictures](https://levels.io/phantomjs-social-media-share-pictures) for [Nomad List](https://nomadlist.com), and how I did them for [Coworkations](https://coworkations.com) with [cardserver](https://github.com/stevelacey/cardserver).

> [!WARNING]
> This project is no longer maintained, check out [stevelacey/cloudflare-screenshot](https://github.com/stevelacey/cloudflare-screenshot)

| [![Coworkations](https://coworkations.com/cards/coworkations.png)](https://coworkations.com/cards/coworkations.png) [📄 HTML](https://coworkations.com/cards/coworkations) [🖼️ PNG](https://coworkations.com/cards/coworkations.png) | [![Hacker Paradise: Cape Town South Africa](https://coworkations.com/cards/hacker-paradise/cape-town-south-africa.png)](https://coworkations.com/cards/hacker-paradise/cape-town-south-africa.png) [📄 HTML](https://coworkations.com/cards/hacker-paradise/cape-town-south-africa) [🖼️ PNG](https://coworkations.com/cards/hacker-paradise/cape-town-south-africa.png) |
| --: | --: |
| **[![Nomad Cruise VI: Spain To Greece](https://coworkations.com/cards/nomad-cruise/nomad-cruise-13-canada-to-japan-sep-2024.png)](https://coworkations.com/cards/nomad-cruise/nomad-cruise-13-canada-to-japan-sep-2024.png) [📄 HTML](https://coworkations.com/cards/nomad-cruise/nomad-cruise-13-canada-to-japan-sep-2024) [🖼️ PNG](https://coworkations.com/cards/nomad-cruise/nomad-cruise-13-canada-to-japan-sep-2024.png)** | **[![PACK: Ubud Bali](https://coworkations.com/cards/pack/ubud-bali-2.png)](https://coworkations.com/cards/pack/ubud-bali-2.png) [📄 HTML](https://coworkations.com/cards/pack/ubud-bali-2) [🖼️ PNG](https://coworkations.com/cards/pack/ubud-bali-2.png)** |


Setup
-----

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/stevelacey/netlify-screenshot)

After deploying to Netlify and setting `BASE_URL` the site should be good to go, try visiting `https://{site-name}.netlify.app/screenshot` for a capture of your homepage.

Any additional path that comes after `/screenshot` is used in the request to your webserver:

```
https://{site-name}.netlify.app/screenshot/**/* -> {BASE_URL}/**/*
```

If you want to change the `BASE_URL` edit the site's environment variables from `Site Settings > Build & deploy > Environment`, the value should be the root domain of your website e.g. `https://example.com`.


Usage
-----

Netlify Screenshot performs HTML requests based on PNG requests like so:

| 🖼 PNG (Netlify request) | 📄 HTML (webserver request) |
| :--------------------------------------------------------------------- | :---------------------------------------------- |
| https://stevelacey.netlify.app/screenshot/cards/steve.png              | https://steve.ly/cards/steve                    |
| https://coworkations.netlify.app/screenshot/cards/coworkations.png     | https://coworkations.com/cards/coworkations     |
| https://coworkations.netlify.app/screenshot/cards/hacker-paradise.png  | https://coworkations.com/cards/hacker-paradise  |
| https://coworkations.netlify.app/screenshot/cards/pack/ubud-bali-2.png | https://coworkations.com/cards/pack/ubud-bali-2 |

If you want to serve your cards on the same domain as your app, you can route PNG traffic to Netlify via NGINX:

```
location ~ ^/(cards/.*\.png)$ {
  proxy_pass http://{site-name}.netlify.app/screenshot/$1;
}
```

Then your URLs can look something like this:

| 🖼 PNG (Netlify request) | 📄 HTML (webserver request) |
| :-------------------------------------------------- | :---------------------------------------------- |
| https://steve.ly/cards/steve.png                    | https://steve.ly/cards/steve                    |
| https://coworkations.com/cards/coworkations.png     | https://coworkations.com/cards/coworkations     |
| https://coworkations.com/cards/hacker-paradise.png  | https://coworkations.com/cards/hacker-paradise  |
| https://coworkations.com/cards/pack/ubud-bali-2.png | https://coworkations.com/cards/pack/ubud-bali-2 |

Alternatively, you can route all `/screenshots/` traffic to Netlify, then prefix any path on your site with `/screenshots/` to capture a screenshot.

```
location /screenshots/ {
  proxy_pass http://{site-name}.netlify.app/screenshot/;
}
```

Note that query params are passed through to your backend, which can be useful if you want to toggle features like Cookiebot or Intercom on/off.


Caching
-------

Netlify Screenshot serves sensible cache headers, and allows you to suffix requests with `.png` which helps reverse proxies like Cloudflare recognize the content as cacheable.

In addition to that, you might want to cache results locally so they don't hit Netlify every time.

To do that, add something like this to your `nginx.conf`:

```
proxy_cache_path /tmp/nginx levels=1:2 keys_zone=static:10m max_size=10g inactive=7d use_temp_path=off;
proxy_cache_valid 7d;
```

And update your location block like so:

```
location /screenshots/ {
  proxy_cache static;
  proxy_pass http://{site-name}.netlify.app/screenshot/;
}
```


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
