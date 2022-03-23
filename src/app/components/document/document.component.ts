import { Component, OnInit, OnDestroy } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable, Subscription, timer } from 'rxjs';
import { startWith } from 'rxjs/operators';
import { Document } from 'src/app/models/document.model';
import { DocumentService } from 'src/app/services/document.service';
@Component({
  selector: 'app-document',
  templateUrl: './document.component.html',
  styleUrls: ['./document.component.scss']
})
export class DocumentComponent implements OnInit, OnDestroy {
  width = -400
  showchatbot = false ;
  userid = "";
  text:string;
  nameid = 'Client';
  document: Document;
  fulldoc = [];
  doc = [];
  showroom = 1;
  value = "";
  listroom = [{id:1,name:'Bot'},{id:2,name:"Client"}]
  private _docSub: Subscription;
  private _docSubfull: Subscription;

  constructor(private documentService: DocumentService,
              private socket: Socket) {}

  ngOnInit() {
    const subscribe = timer(1000,1000).subscribe(val => this.getdocc())

  }
  chatbox(){
    this.showchatbot = !this.showchatbot
    this.width = 10
  }
  closechatbox(){
    this.showchatbot = !this.showchatbot
    this.width = -400
  }
  getdocc(){
    this.documentService.getDocument()
    this.userid = this.documentService.id
    this.documentService.documentfull
    .subscribe(document => {
      this.fulldoc = Object.values(document)
});
this.documentService.documents
    .subscribe(document => {
      this.doc = document
});
    
  }
  ngOnDestroy() {
    this._docSub.unsubscribe();
  }
  onChange(e){
    this.showroom = e.target.value
  }
  editDoc() {
    var i = true
    if(this.showroom ==1 ){
    if(this.text.length>0){
    this.documentService.newDocument(this.text)
    this.text = "";
  };
}else{
  if(this.text.length>0){
    this.documentService.newDocumentClient(this.text)
    this.text = "";
}
  
}
  }

    

}
