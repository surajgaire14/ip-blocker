const requestIp = require("request-ip");
const geo = require("geoip-lite");

const getIp = (req,res) => {
  let ip = requestIp.getClientIp(req);
  ip = geo.lookup("27.34.22.216");
  console.log(ip)

  try {
    if (ip) {
      return res.status(200).json({ data: ip });
    }
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
};

module.exports = getIp
