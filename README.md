## Initial Setup

To get around CORS-related issues with the API, I have utilized cors-anywhere to get around browser rules. The config.json shown below should work by making use of a demo proxy server but it has limits on the numbers of requests put through. For extensive testing, I suggest running your own server locally. Instructions for that can be found in the second section below.

To get the project running, create a file in the src folder titled `config.json`.

Minimally, the file should contain the following:

```
{
  "corsProxy": "https://cors-anywhere.herokuapp.com",
  "apiKey": "api_key_goes_here"
}
```

### Running your own cors proxy

To get a proxy running, do the following:

```
git clone https://github.com/Rob--W/cors-anywhere.git

cd cors-anywhere

export PORT=8080

node server.js
```

And set `"corsProxy": "http://localhost:8080"` in your `config.json`.
