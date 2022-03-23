const { fstat } = require('fs');
var fs = require("fs");
const Binance = require('node-binance-api');
const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const documents = [];
const documentsfull = {};
      app.io = io;
//call function read file
loadconfigFile("../config.json")
//function read file 
function loadconfigFile(file){
  var obj;
  fs.readFile(file,"utf8",function(err,data){
    if(err) throw err;
    obj = JSON.parse(data);
    const binance = new Binance().options({
      APIKEY: obj.API,
      APISECRET: obj.KEY
    });
    
    binance.futuresTickerStream( 'BTCUSDT', (data) => {
      app.io.sockets.emit("pricebtc",data)
    });
    binance.futuresTickerStream( 'ETHBUSD', (data) => {
      app.io.sockets.emit("priceeth",data)
    });
    binance.futuresTickerStream( 'DOGEUSDT', (data) => {
      app.io.sockets.emit("pricedoge",data)
    });
    binance.futuresTickerStream( 'BNBUSDT', (data) => {
      app.io.sockets.emit("pricebnb",data)
    });
    binance.futuresTickerStream( (data) => {
      app.io.sockets.emit("priceall",data)
    })

   
})
}
async function botstr(findStr){
  var { NlpManager } = require('node-nlp');       //natural language processing for chatbot
  const manager = new NlpManager({ languages: ['en'], nlu: { useNoneFeature: false }});
  //train the chatbot
  manager.addDocument('en', "binance", 'moneycontrol');
  manager.addDocument('en', 'goodbye for now', 'greetings.bye');
  manager.addDocument('en', 'bye bye take care', 'greetings.bye');
  manager.addDocument('en', 'bye bye', 'greetings.bye');
  manager.addDocument('en', 'feel', 'greetings.feel');
  manager.addDocument('en', 'bye for now', 'greetings.bye');
  manager.addDocument('en', 'i must go', 'greetings.bye');
  manager.addDocument('en', 'How are you', 'greetings.healthy');
  manager.addDocument('en', 'hi', 'greetings.hello');
  manager.addDocument('en', 'hello', 'greetings.hello');
  manager.addDocument('en', 'Xin chao', 'greetings.hello');
  manager.addAnswer('en', 'greetings.hello', 'Hello,How are you!');
  manager.addAnswer('en', 'greetings.feel', 'Oh, Good');
  manager.addAnswer('en', 'greetings.bye', 'Good bye,See you again!');
  manager.addAnswer('en', 'greetings.healthy', 'I`m fine Thanks,How do you feel today?');
  manager.addAnswer('en', 'moneycontrol', '<a class="fx-widget" data-widget="crypto-market-movers" data-lang="en" data-crypto-type="coins" data-primary-text-color="#333333" data-secondary-text-color="#999999" data-border-color="#d8d8d8" data-background-color="#ffffff" data-header-background-color="#eeeeee" data-header-text-color="#333333" data-drop-down-title-color="#333333" data-drop-down-text-color="#a3a3a3" data-drop-down-border-color="#d8d8d8" data-width="775" data-height="560" data-chart data-full-view data-url="https://www.binance.com/en" href="https://www.binance.com/en" rel="nofollow" style="font-family:Helvetica;font-size:16px;line-height:1.5;text-decoration:none;"> <span style="color:#999999;display:inline-block;margin-top:10px;font-size:12px;">Powered By </span> <img width="87px" height="14px" src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/Binance_logo.svg/2560px-Binance_logo.svg.png" alt="FX Empire logo" /> </a> <script async charset="utf-8" src="https://public.bnbstatic.com/static/js/ocbs/binance-fiat-widget.js" ></script>');
  await manager.train();
  manager.save();
  var response = await manager.process('en', findStr);
  console.log(response);
  console.log(typeof(response.answer));
  return response.answer;
}

io.on("connection", socket => {
    let previousId;
    const safeJoin = currentId => {
      socket.leave(previousId);
      socket.join(currentId, () => console.log(`Socket ${socket.id} joined room ${currentId}`));
      previousId = currentId;
    };
    socket.on("getDoc",() => {
        socket.emit('getId',socket.id)
        socket.emit("documentfull", documentsfull);
        io.emit('documents', documents);
      });
      socket.on("addDoc", doc => {
        documents.push(doc);
        socket.emit('documents', documents);
        safeJoin(doc.id);
        botstr(doc.doc)
        .then(result => {
            if(result == null){
              documents.push({id:"Bot",doc:"I dont Understand, Sorry !!!"});
            }
            else{
              documents.push({id:"Bot",doc:result});
              return
            }
        });
      });
      socket.on("addDocClient", doc => {
       
        documentsfull[doc.id] = doc;
        socket.emit("documentfull", documentsfull);
      
      })
      socket.on("editDoc", doc => {
        documents[doc.id] = doc;
        
        socket.to(doc.id).emit("document", doc);
      });
      io.emit("documents", Object.keys(documents));
      
      io.emit("documentfull", documents);
      console.log(`Socket ${socket.id} has connected`);
  });
  http.listen(4444, () => {
    console.log('Listening on port 4444');
  });