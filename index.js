/**
 * Module dependencies.
 */

var express = require('../../');

var app = module.exports = express();


var bodyParser = require('body-parser');
var multer = require('multer'); 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(multer());


var jsonParser = bodyParser.json()

//＝＝＝＝＝ 初始化資料庫 ＝＝＝＝＝
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/ShockAudio-API');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
  console.log('MongoDB: connected.'); 
});
//新增Schema
var postSchema = new mongoose.Schema({
    ordersName: { type: String, default: ''},
    content: String,
    timeCreated: { type: Date, default: Date.now },
    ordersId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    orders: []

});
app.db = {//宣告 model
  orders: mongoose.model('Order', postSchema),//宣告postSchema為‘Post’如果Schema為Post 的話 collections 就要為 posts
};


//＝＝＝＝＝ 初始化資料庫 ＝＝＝＝＝

// create an error with .status. we
// can then use the property in our
// custom error handler (Connect repects this prop as well)

function error(status, msg) {
  var err = new Error(msg);
  err.status = status;
  return err;
}

// if we wanted to supply more than JSON, we could
// use something similar to the content-negotiation
// example.

// here we validate the API key,
// by mounting this middleware to /api
// meaning only paths prefixed with "/api"
// will cause this middleware to be invoked
app.use('/api', function(req, res, next){
  var key = req.query['api-key'];

  // key isn't present
  if (!key) return next(error(400, 'api key required'));

  // key is invalid
  if (!~apiKeys.indexOf(key)) return next(error(401, 'invalid api key'));

  // all good, store req.key for route access
  req.key = key;
  next();
});
app.all('*', function(req, res, next){
  if (!req.get('Origin')) return next();
  // use "*" here to accept any origin
  res.set('Access-Control-Allow-Origin', '*'); //可以允許不同網域的人來讀取此網頁
  res.set('Access-Control-Allow-Methods', 'PUT');
  res.set('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type');
  // res.set('Access-Control-Allow-Max-Age', 3600);
  if ('OPTIONS' == req.method) return res.send(200);
  next();
});
//＝＝＝＝＝ Test Data ＝＝＝＝＝
var users = [
    { name: 'tobi' }
  , { name: 'loki' }
  , { name: 'jane' }
];



//＝＝＝＝＝ Test Data ＝＝＝＝＝

//＝＝＝＝＝ REST API ＝＝＝＝＝

app.post('/setOrder', function (req, res) {
  var ordersName = req.body.ordersName;
  var content = req.body.content;

  var orders = req.app.db.orders;

   var data = {
     ordersName: ordersName,
     content: content
   };
   var order = new orders(data);//新開一個文件的意思
   order.save();//存檔，資料內 mongodb 會自動加上一個 _id 為檔名的意思

  res.json('statuscode:200');//response
})


app.post('/push', function (req, res) {
apns(
  "7cbd2956-87c7c24f-c2baf5b8-471b5dde-2ca6caad-8eeb0679-c7b6eb96-4897b16c"
  ,100
  ,"hello"
  )

  res.json('statuscode:200');//response
})
//＝＝＝＝＝ REST API ＝＝＝＝＝
function apns(deviceToken, badge, alert) {

var apn = require('apn');
var notify = new apn.Notification();
notify.device = new apn.Device(deviceToken); // ""裡面放欲推撥裝置的token
notify.badge = badge;     // App icon上面的數字badge
notify.alert = alert;    // 推撥顯示文字
notify.co=1;
new apn.Connection({ 
    cert:'cert.pem',
    key:'key.pem',
    gateway:'gateway.sandbox.push.apple.com'
   }).sendNotification(notify);
}
// middleware with an arity of 4 are considered
// error handling middleware. When you next(err)
// it will be passed through the defined middleware
// in order, but ONLY those with an arity of 4, ignoring
// regular middleware.
app.use(function(err, req, res, next){
  // whatever you want here, feel free to populate
  // properties on `err` to treat it differently in here.
  res.status(err.status || 500);
  res.send({ error: err.message });
});

// our custom JSON 404 middleware. Since it's placed last
// it will be the last middleware called, if all others
// invoke next() and do not respond.
app.use(function(req, res){
  res.status(404);
  res.send({ error: "Lame, can't find that" });
});

/* istanbul ignore next */
if (!module.parent) {
  app.listen(3000);
  console.log('Express started on port 3000');
}
