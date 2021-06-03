# Fortune Cookie
## This webapp serves fortune cookies using Express.js and DynamoDB!

You can either use `./form` or send `POST` and `GET` requests to the webapp to view, create (only if you're logged-in), and login as listed below in the APIs.

I served this app on AWS EC2 micro.

## Usage and screenshots
`GET ./`
Fortune cookies are served through get request.

`POST ./`
If you are logged in, you can post cookies by sending a JSON payload. It responds with `400` status code for errors.

`POST ./`
If you are logged in, you can post cookies by sending a JSON payload. It responds with `401` status code for incorrect logins.

`./form`
You can use forms to log in and after logging in, post cookies. Forms are generated through `pug` template engine. 

## Install & run Instructions:
1. Set up an AWS account and local config for access.
1. Tweak configs at `config.js`. (ex. AWS regions, port, serve construction page)
1. Run `initialization.js` to create `Users` and `Fortunes` tables in `DynamoDB`.
    1. You can tweak `fortuneCookiesListFile` to automatically load fortune cookies. (ex. `text`)
1. Run `app.js` to run `fortunecookie`.

## Files:

### Helpers (within ./Helpers folder):
* `initialization.js` initializes Users and Fortune Table on DynamoDB. It is a part of the required files to run during installation.

### Key Components:
* `public/construction.html` is the construction page that is served.
* `APIHelpers.js` is where you find the functions used in the routers (api endpoints).
* `app.js` is what runs this app. It mainly consists of routers to api endpoints.
* `config.js` contains configs for AWS regions, port, serve construction page.
* `fortunesAppObj.js` contains a model to keep track of the number of total fortune cookies.
* `middleware.js` is where you find the definitions of some middlewares that are defined in this app and its helper functions.
* `tests.js` contains unit tests and integration tests currently using 'assert'.