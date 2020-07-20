import { Component, OnInit } from '@angular/core';
import { Item } from '../_models/item';
import { ToastController } from '@ionic/angular';
import { DatabaseService } from '../_services/database.service';
import { async } from '@angular/core/testing';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  todoItems: Item[] = [];
  inputText: string;

  constructor(private toastController: ToastController,
              private db: DatabaseService) {}

  ngOnInit() {
    this.inputText = '';
    // this is not working
    this.db.getDatabaseState().subscribe(ready => {
      if (ready) {
        this.db.getTodos().subscribe(todos => {
          this.todoItems = todos;
        });
      }
    });
  }

  addItem(){
    console.log(this.inputText);
    if (this.inputText.length < 1) {
      return;
    }

    const newId = Math.floor(Math.random() * 10000) + 1;
    const newItem: Item = new Item(newId, this.inputText);

    // not working
    // this.db.addTodo(newItem.id, newItem.text, newItem.done === false ? 0 : 1);

    this.todoItems.push(newItem);
    this.inputText = '';
  }

  toggleItem(id: number) {
    const index = this.todoItems.findIndex(x => x.id === id);
    const item = this.todoItems[index];

    // this.db.updateTodo(item);

    console.log(this.todoItems[index]);
  }

  async removeItem(id: number) {
    // this.db.deleteTodo(id).then(async (data) => {
    //   const toast = await this.toastController.create({
    //     message: 'Item deleted.',
    //     duration: 1000,
    //     position: 'top'
    //   });
    //   toast.present();
    // });

    const index = this.todoItems.findIndex(x => x.id === id);

    if (index >= 0){
      this.todoItems.splice(index, 1);
      const toast = await this.toastController.create({
        message: 'Item deleted.',
        duration: 1000,
        position: 'top'
      });
      toast.present();
    }
  }
}
