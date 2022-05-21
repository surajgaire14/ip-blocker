/**
 * * @imports => node registry packages imports
 */
const cors = require("cors");
const express = require("express");
const csrf = require("csurf");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");

/**
 * * @setups => application setups
 * * Contains security and middleware setups
 */
const app = express();
app.use(cors());
// parse application/json
app.use(bodyParser.json());

/**
 * @dev Cross-site request forgery protection
 */
const csrfProtection = csrf({ cookie: true });
app.use(cookieParser());
// parse application/x-www-form-urlencoded
var parseForm = bodyParser.urlencoded({ extended: false });

/**
 * @dev X-Powered-By for Security, Save Bandwidth in ExpressJS(Node.js)
 * */
app.use(helmet());
app.disable("x-powered-by");

/**
 * * @routes => application routes
 */
app
  .get("/", csrfProtection, (req, res) => {
    res.json({
      msg: "Welcome to The Boring School's IP Address Banner API 🚀.",
      csrfToken: req.csrfToken(),
    });
  })
  /**
   * @dev POST /ip => may raise Invalid CSRF Token error, solution explained
   * * Add header on client request
   * * {CSRF-Token = "Cross-site request forgery protection token"}
   * * Note: "Call "/" to get the CSRF-Token" once and set to 
   * * localStorage or Cookie in client side.
   */
  .post("/ip", parseForm, csrfProtection, (req, res) => {
    res.json({
      body: req.body,
    });
  })
  .get("*", (req, res) =>
    res.json({
      msg: "404 Not Found!",
    })
  );

module.exports = app;
