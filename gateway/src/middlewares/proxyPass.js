import proxy from 'express-http-proxy';

const proxyPass = (paths, url, options) => {
  paths.forEach((path) => {
    console.log(`Proxy pass set at ${url}${path}`);
  });

  const proxyOptions = {};
  if (options.useOriginalUrl) {
    proxyOptions.proxyReqPathResolver = function (req) {
      return req.originalUrl;
    };
  }

  return paths, proxy(url, proxyOptions);
};

export default proxyPass;
