# ContactLab API Stubber

This is a simple API stubber for testing purposes.

## How to use

The stubber responses are based on a filesystem hierarchy of JSON files, so to
simulate the behaviour of your API you need to reproduce the HTTP URI using path
on your filesystem. The final part of your URL and the HTTP method define the
name of the JSON file that the simple stubber will read to respond to your test
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

## A note on HTTP POSTs

This stubber has a basi support for POST requests, so the parameters should be
very simple, similar to a GET request.

## How to run

    $ node index.js --port=8081 --path=/path/to/data

Port is by default 8081 and data is `path.join(__dirname, 'data')`.

## TODOs

- better HTTP OPTIONS handling: now, by default, all HTTP OPTIONS responses
  returns a 200 status code
- better HTTP POST handling: add support for more structured parameters
