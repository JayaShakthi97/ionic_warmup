export class Item{
    id: number;
    text: string;
    done = false;

    constructor(id: number, text: string, done?: boolean){
        this.id = id;
        this.text = text;
        this.done = done;
    }

    toggleDone() {
        this.done = !this.done;
    }
}
