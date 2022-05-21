/**
 * * @imports => node registry packages imports
 */
const cors = require("cors");
const express = require("express");
const csrf = require("csurf");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const NodeCache = require("node-cache");
// const customCache = new NodeCache();

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
app.use(helmet.hidePoweredBy());
app.use(helmet.noSniff());

/**
 * @dev Rate Limiting
 */
const apiLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 10 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
/**
 * * @routes => application routes
 */
app
  .get("/", apiLimiter, csrfProtection, async (req, res) => {
    const message = "Welcome to The Boring School's IP Address Banner API 🚀.";

    try {
      const csrfToken = await req.csrfToken();

      /**
       * @dev caching not required since api limiter is working!
       */
      // customCache.set("csrfToken", csrfToken, 10 * 60);

      res.json({
        msg: message,
        csrfToken,
      });
    } catch (error) {
      console.log(error);
    }
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
