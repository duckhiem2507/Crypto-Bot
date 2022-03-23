import { Injectable, OnInit } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Document } from 'src/app/models/document.model';
@Injectable({
  providedIn: 'root'
})
export class DocumentService  {
  idname="khiem"
  id:string;
  value=true
  count=1
  currentDocument = this.socket.fromEvent<Document>('document');
  documents = this.socket.fromEvent<string[]>('documents');
  documentfull = this.socket.fromEvent<string[]>('documentfull');
  getid = this.socket.fromEvent<string>('getId');
  chatmessage = this.socket.fromEvent<string>('chatmessage');

  constructor(private socket: Socket) { }

  getDocument() {
    this.socket.emit('getDoc');
    this.getid
    .subscribe( id => {
      this.id = id
});
  }

  newDocument(doc) {

    this.socket.emit('addDoc', { id: `${this.id}${this.count++}`,user:this.id, doc: doc });
  }
  newDocumentClient(doc) {

    this.socket.emit('addDocClient', { id: `${this.id}${this.count++}`,user:this.id, doc: doc });
  }

  editDocument(document: Document) {
    this.socket.emit('editDoc', document);
  }

}
