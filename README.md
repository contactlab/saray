:warning: **This project is no longer mantained**

<!-- # Saray -->

![Saray](saray.png)

[![Build Status](https://travis-ci.org/contactlab/saray.svg?branch=master)](https://travis-ci.org/contactlab/saray)
[![GitHub tag](https://img.shields.io/github/release/contactlab/saray.svg?style=flat-square)](https://github.com/contactlab/saray)
[![npm](https://img.shields.io/npm/dt/saray.svg?style=flat-square)](https://github.com/contactlab/saray)
[![Package Quality](http://npm.packagequality.com/shield/saray.png?style=flat-square)](http://packagequality.com/#?package=saray)

```javascript
'Yet Another Rest API Stubber'.split(' ').reverse().map(item => item[0].toLowerCase()).join('')
```

> This is a simple API stubber for testing purposes.

## How to use

The stubber responses are based on a filesystem hierarchy of JS and JSON files, so to
simulate the behaviour of your API you need to reproduce the HTTP URI using path
on your filesystem. The final part of your URL and the HTTP method define the
name of the JSON/JS file that the simple stubber will read to respond to your test
requests.
Probably it's better explained with an example.

### Example

For a simple `HTTP GET`:

- test URL to map: `HTTP GET` to  `/give/me/some/data`
- JSON file path: `[root]/give/me/some/data.GET.json`

For a parametrized `HTTP GET`:

- test URL to map: `HTTP GET` to  `/give/me/some/data?traveler=marty&friend=emmet`
- JSON file path: `[root]/give/me/some/data?traveler=marty&friend=emmet.GET.json`

For a parametrized `HTTP POST`:

- test URL to map: `HTTP POST` to  `/give/me/some/data` with `x-www-form-urlencoded` parameters like
  traveler:marty
  friend:emmet
- JSON file path: `[root]/give/me/some/data?traveler=marty&friend=emmet.POST.json`

The same applies for the others `HTTP` methods.

## Data stubbed in JS format

From version 1.5.0 Saray has the built-in support for data stubbed in JS format. With this new format, you can prepare scriptable stubbed data interpeted directly by Node.js.

Every JS-stubbed file must be a Node.js module exporting a single function. This function can take up to four parameters:

- *req*: [Express Request object](http://expressjs.com/en/4x/api.html#req)
- *res*: [Express Response object](http://expressjs.com/en/4x/api.html#res)
- *log*: [Bunyan Log object](https://github.com/trentm/node-bunyan)
- *next*: next middleware function

For example:

```javascript
// give/me/some/data.GET.js

module.exports = function(req, res, log, next) {
  res.json(
    {
      key: 'value'
    }
  );
};
```

## Endpoint integration

Saray can act as a proxy between the client and your api endpoint. So, if you configure an endpoint through Saray options, the api stubber can redirect the call for which you haven't defined stubbed data directly to your real APIs.

Using the parameter `--prefer-api`, Saray prefers the real API instead of stubbed data. So if you provide stubbed data for a call that exists also on the endpoint, Saray will prefer the real API response instead of the stubbed one. This is always valid, except in the case in which the real API returns an http 404 or 405. In this case Saray prefers the stubbed data.

For example:

- You have a stub like give/me/some/data.GET.js
  You run an HTTP GET on mydomain:port/give/me/some/data

  If you use `--prefer-api` and the endpoint responds with an HTTP code != 404 or 405, Saray will proxy your request

  If you use `--prefer-api` and the endpoint responds with an HTTP code == 404 or 405, Saray will stub your request

## Dynamic path

From version 1.7.0 Saray has the support for dynamic paths, using the parameter `--dynpath`.

Probably an example is worth a thousand words.

Setting `--dynpath='_'`, we can put stubbed data in a path like :

`give/me/_/data.GET.js`

Then, we can call:

```
http://mydomain:port/give/me/my/data
http://mydomain:port/give/me/your/data
http://mydomain:port/give/me/his/data
http://mydomain:port/give/me/her/data
```

and for all these calls Saray will respond with the stubbed data precedently defined.

This can be done without limitations, so we can also stub some data like:

`give/_/_/data.GET.js`

Then, we can call:

```
http://mydomain:port/give/me/my/data
http://mydomain:port/give/you/your/data
http://mydomain:port/give/he/his/data
http://mydomain:port/give/them/her/data
```

and for all these calls Saray will respond with the stubbed data precedently defined.

## Endpoint timeout

From version 1.7.1 it is possible to set a timeout (default to 60 seconds) for a better handling of the endpoint option.
With this parameter Saray can handle a pending call to the endpoint (the one specified with the --endpoint flag) with a timeout handler and, in case, return an HTTP 408.

## Installation & run

You can install Saray with npm or yarn

```bash
$ npm install saray
```

If you install Saray globally, then you can simply start Saray with

```bash
$ saray --port 8081 --path /path/to/data --endpoint 'https://myapis.com' --prefer-api
```

Otherwise, in a local installation you can find Saray in your node_modules/.bin folder.

## Clone

Alternatively you can clone this repo, then from the command line run

```
$ npm install
```

to install all required dependencies, then you can run

```
$ node index.js --port 8081 --path /path/to/data --endpoint 'https://myapis.com' --prefer-api
```

## Help
```
$ saray --help

  Usage: index [options]

  'Yet Another Rest API Stubber'.split(' ').reverse().map(item => item[0].toLowerCase()).join('')

  Options:

    -h, --help                output usage information
    -V, --version             output the version number
    --port <port>             The port to listen to (default: 8081)
    --path <password>         The path for stubbed data (default ./data)
    --endpoint <endpoint>     The endpoint (default null)
    --pfer-api, --prefer-api  Prefer API enpoint to stubbed data (default: false)
    --log <log_path>          Log file path
    --root <root_path>        The base root path (default: empty)
    --dynpath <dynpath_str>   The string used as dynamic folder/file in path. Feature disabled with unset option (default: null)
```

## Available commands

```
$ npm test
```

Run unit tests and integration tests for Saray.

```
$ npm start
```

Start Saray from command line directly from cloned repository
