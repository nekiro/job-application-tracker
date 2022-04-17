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
    proxyOptions.userResHeaderDecorator = function (
      headers,
      userReq,
      userRes,
      proxyReq,
      proxyRes
    ) {
      // recieves an Object of headers, returns an Object of headers.
      //console.log(userReq.getHeaders());
      console.log(headers);
      return headers;
    };
  }

  return paths, proxy(url, proxyOptions);
};

export default proxyPass;
