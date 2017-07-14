// probably this should be a middleware
const fs = require('fs');
const path = require('path');

function seekFileFallback(apiDataPath, reqPath, dynPath, req, ext, params)
{
  if (!reqPath) {
    return false;
  }
  let seekingPath = path.join(apiDataPath, `${reqPath}${params}.${req.method}.${ext}`);
  if (fs.existsSync(seekingPath)) {
    return seekingPath;
  }
  let paths = reqPath.split('/');
  let pathParams = [];
  let actualPath = [];
  while (paths.length > 0) {
    let p = paths.shift();
    if (p === '') {
      actualPath.push(p);
      continue;
    }
    let isFile = paths.length === 0;
    let part = p;
    if (isFile) {
      part = `${p}${params}.${req.method}.${ext}`;
    }
    seekingPath = path.join(apiDataPath, `${actualPath.join('/')}/${part}`);
    if (!fs.existsSync(seekingPath)) {
      if (isFile) {
        part = `${dynPath}${params}.${req.method}.${ext}`;
      } else {
        part = `${dynPath}`;
      }
      seekingPath = path.join(apiDataPath, `${actualPath.join('/')}/${part}`);
      if (!fs.existsSync(seekingPath)) {
        seekingPath = false;
      } else {
        pathParams.push(p);
      }
    }
    if (seekingPath !== false) {
      if (isFile) {
        req.dynamicPathParams = pathParams;
        return seekingPath;
      } else {
        actualPath.push(part);
      }
    } else {
      return false;
    }
  }
  return false;
}

module.exports = seekFileFallback;