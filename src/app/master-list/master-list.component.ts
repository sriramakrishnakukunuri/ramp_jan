import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-master-list',
  templateUrl: './master-list.component.html',
  styleUrls: ['./master-list.component.css']
})
export class MasterListComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    // Initialization logic here
  }
  SelectedCategory: any = 'Location';
getDataByCategory(val: any) {
  this.SelectedCategory = val;
}

}