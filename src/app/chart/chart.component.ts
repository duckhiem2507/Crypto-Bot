import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Socket } from 'ngx-socket-io';
declare const TradingView: any;
@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements OnInit,AfterViewInit  {
  Coin = []
  pricebtc = {}
  priceeth = {}
  pricedoge = {}
  pricebnb = {}
  priceall = {}
  oder = []
  btcbuy = true
  tradingview = "none"
  ngAfterViewInit() {
    // need to do this in AfterViewInit because of the Input
    setTimeout( () => {
      new TradingView.widget(
        {
        "width": 900,
        "height": 650,
        "symbol": "BINANCE:BTCUSDT" ,
        "timezone": "Asia/Ho_Chi_Minh",
        "theme": "dark",
        "style": "1",
        "locale": "vi_VN",
        "toolbar_bg": "#f1f3f6",
        "enable_publishing": false,
        "range": "YTD",
        "hide_side_toolbar": false,
        "allow_symbol_change": true,
        "container_id": "tradingview_63d50"
      }
        );
  })
}
  constructor(private socket: Socket) { }
  ngOnInit(): void {
  this.getBtc()
  this.getEth()
  this.getDoge()
  this.getShib()
  this.getall()
  }
  showtradingview(){
    this.tradingview = "block"
  }
  closeshowtradingview(){
    this.tradingview = "none"
  }
  getBtc(){
    this.socket.on('pricebtc', (data) => {
      this.Coin[0] = data
      if(data.close <= 61100 && this.btcbuy == true){
        this.oder.push("buy BTC")
        this.btcbuy = false
      }
      if(data.close >= 61500 && this.btcbuy == false){
        this.oder.push("sell BTC")
        this.btcbuy = true
      }
  }
  )}
  getEth(){
    this.socket.on('priceeth', (data) => {
      this.Coin[1] = data
  }
  )}
  getDoge(){
    this.socket.on('pricedoge', (data) => {
      this.Coin[2] = data
  }
  )}
  getShib(){
    this.socket.on('pricebnb', (data) => {
      this.Coin[3] = data
  }
  )}
  getall(){
    this.socket.on('priceall', (data) => {

      this.priceall = data.sort((a, b) => parseFloat(b.close) - parseFloat(a.close)).splice(0,10)
  }
  )}
}
