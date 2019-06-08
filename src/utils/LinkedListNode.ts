export class LinkedListNode<T> {
    public value : T;
    public next? : LinkedListNode<T>;

    constructor(value : T, next?: LinkedListNode<T>) {
      this.value = value;
      this.next = next;
    }

    public toString(callback : (value: T) => void) {
      return callback ? callback(this.value) : `${this.value}`;
    }
  }