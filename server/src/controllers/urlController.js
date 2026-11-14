const urlService = require('../services/urlService');

async function getUrls(req, res, next) {
  try {
    const urls = await urlService.getRecentUrls();
    res.status(200).json(urls);
  } catch (err) {
    next(err);
  }
}

async function shortenUrl(req, res, next) {
  try {
    const { long_url, custom_alias, expires_in_days } = req.body;

    if (!long_url || !/^https?:\/\//i.test(long_url.trim())) {
      const err = new Error('A valid HTTP/HTTPS long_url is required');
      err.statusCode = 400;
      return next(err);
    }

    const created = await urlService.createShortUrl({
      long_url,
      custom_alias,
      expires_in_days,
    });

    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
}

async function redirectUrl(req, res, next) {
  try {
    const longUrl = await urlService.resolveShortCode(req.params.shortCode);
    // 302 Temporary Redirect prevents browser caching so click counts stay accurate
    res.redirect(302, longUrl);
  } catch (err) {
    next(err);
  }
}

module.exports = { getUrls, shortenUrl, redirectUrl };