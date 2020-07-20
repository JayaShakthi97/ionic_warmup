import { Injectable } from '@angular/core';
import { SQLiteObject, SQLite } from '@ionic-native/sqlite/ngx';
import { BehaviorSubject, Observable } from 'rxjs';
import { Platform } from '@ionic/angular';
import { SQLitePorter } from '@ionic-native/sqlite-porter/ngx';
import { HttpClient } from '@angular/common/http';
import { Item } from '../_models/item';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  private database: SQLiteObject;
  private dbReady: BehaviorSubject<boolean> = new BehaviorSubject(false);

  todos = new BehaviorSubject([]);

  constructor(private platform: Platform,
              private sqlitePorter: SQLitePorter,
              private sqlite: SQLite,
              private http: HttpClient
    ) {
      this.platform.ready().then(() => {
        this.sqlite.create({
          name: 'todo.db',
          location: 'default'
        }).then((db: SQLiteObject) => {
          this.database = db;
          this.seedDatabase();
        });
      });
     }

     seedDatabase() {
      this.http.get('assets/seed.sql', { responseType: 'text'})
      .subscribe(sql => {
        this.sqlitePorter.importSqlToDb(this.database, sql)
          .then(_ => {
            this.loadTodos();
            this.dbReady.next(true);
          })
          .catch(e => console.error(e));
      });
    }

    getDatabaseState() {
      return this.dbReady.asObservable();
    }

    getTodos(): Observable<Item[]> {
      return this.todos.asObservable();
    }

    loadTodos() {
      return this.database.executeSql('SELECT * FROM todo', []).then(data => {
        let todos: Item[] = [];

        if (data.rows.length > 0) {
          for (let i = 0; i < data.rows.length; i++) {
            const done = data.rows.item(i).done === 1;

            todos.push(new Item(
              data.rows.item(i).id,
              data.rows.item(i).text,
              done,
            ));
          }
        }
        this.todos.next(todos);
      });
    }

    addTodo(id, text, done) {
      const data = [id, text, done];
      return this.database.executeSql('INSERT INTO todo (id, text, done) VALUES (?, ?, ?)', data)
      .then(_ => {
        this.loadTodos();
      });
    }

    deleteTodo(id) {
      return this.database.executeSql('DELETE FROM todo WHERE id = ?', [id])
      .then(_ => {
        this.loadTodos();
      });
    }

    updateTodo(todo: Item) {
      const data = [todo.text, todo.done === false ? 0 : 1];
      return this.database.executeSql(`UPDATE todo SET text = ?, done = ? WHERE id = ${todo.id}`, data)
      .then(_ => {
        this.loadTodos();
      });
    }
}
