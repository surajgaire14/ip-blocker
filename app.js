/**
 * * @imports => node registry packages imports
 */
const cors = require("cors");
const express = require("express");
const csrf = require("csurf");
const bodyParser = require("body-parser");
const csrfProtection = csrf({ cookie: true });
const cookieParser = require("cookie-parser");
const helmet = require("helmet");

/**
 * * @setups => application setups
 * * Contains security and middleware setups
 */
const app = express();
app.use(cors());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());
/**
 * @dev Cross-site request forgery protection
 */
app.use(cookieParser());
/**
 * @dev X-Powered-By for Security, Save Bandwidth in ExpressJS(Node.js)
 * */
app.use(helmet());
app.disable("x-powered-by");

// app.post('/process', parseForm, csrfProtection, function (req, res) {
//     res.send('data is being processed')
//   })

/**
 * * @controllers => application controllers
 */
app
  .get("/", (req, res) =>
    res.json({
      msg: "Welcome to The Boring School's IP Address Banner API 🚀.",
    })
  )
  .get("*", (req, res) =>
    res.json({
      msg: "404 Not Found!",
    })
  );

module.exports = app;
