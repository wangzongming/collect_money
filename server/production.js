const Application = require('thinkjs');
const path = require('path');

const instance = new Application({
  ROOT_PATH: __dirname,
  APP_PATH: path.join(__dirname, 'app'),
  proxy: true, // use proxy
  env: 'production'
});

instance.run();
