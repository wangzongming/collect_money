 
const https = require("https");
const fs = require("fs");

const options = {
  key: fs.readFileSync(think.ROOT_PATH + "/ssl/1_mnetwork.key"),
  cert: fs.readFileSync(think.ROOT_PATH + "/ssl/1_mnetwork.crt")
};

// default config
module.exports = {
  port: 8080,
  workers: 1,
  // 只需要创建服务，不需要 listen
  createServer: function(callback) {
    return https.createServer(options, callback);
  }
};
