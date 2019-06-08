import LinkedList from './LinkedList';

export class Stack<T> {

    public linkedList : LinkedList<T>;

    constructor() {
        this.linkedList = new LinkedList<T>();
    }

    public isEmpty() {
        return !this.linkedList.head;
    }

    public peek() : T | undefined{
        if (!this.linkedList.head) {
            return undefined;
        }
        return this.linkedList.head.value;
    }

    public push(value: T) {
        this.linkedList.prepend(value);
    }

    public pop() {
        const removedHead = this.linkedList.deleteHead();
        return removedHead ? removedHead.value : null;
    }

    public toArray() {
        return this.linkedList
            .toArray()
            .map(linkedListNode => linkedListNode.value);
    }

    public toString(callback: (value : T) => string) {
        return this.linkedList.toString(callback);
    }
}