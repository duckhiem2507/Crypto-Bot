import { Component, OnInit } from '@angular/core';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  background_color = 333

  ngOnInit() {
   
  }
  background(color){
    switch (color) {
      case 0:
          this.background_color
          break;
      case 1:
          this.background_color
          break;
      case 2:
          this.background_color
          break;
    }
  }

}
