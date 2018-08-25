
import model from "think-model" 
import session from "think-session"
const view = require("think-view");  
const cache = require("think-cache");   
module.exports = [
  view, // make application support view
  model(think.app),
  cache, 
  session
];
