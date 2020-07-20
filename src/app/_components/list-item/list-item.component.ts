import { Component, OnInit, Input } from '@angular/core';
import { Item } from '../../_models/item';

@Component({
  selector: 'app-list-item',
  templateUrl: './list-item.component.html',
  styleUrls: ['./list-item.component.scss'],
})
export class ListItemComponent implements OnInit {
  @Input() item: Item;

  constructor() { }

  ngOnInit() {}

}
