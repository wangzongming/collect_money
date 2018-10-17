const isDev = think.env === "development";
const https = require("https");
const fs = require("fs");
let _e = {};
if (isDev) {
  //测试服务器下需要开https服务器

  const options = {
    key: fs.readFileSync(think.ROOT_PATH + "/ssl/1_mnetwork.key"),
    cert: fs.readFileSync(think.ROOT_PATH + "/ssl/1_mnetwork.crt")
  };
  // default config
  _e = {
    port: 8080,
    workers: 0,
    // 只需要创建服务，不需要 listen
    createServer: function(callback) {
      return https.createServer(options, callback);
    }
  };
} else {
  _e = {
    port: 3000,
    workers: 0
  };
}
module.exports = _e;