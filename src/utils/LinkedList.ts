import {LinkedListNode} from './LinkedListNode';
import {Comparator, ComparatorFunction} from './Comparator';

export default class LinkedList<T> {

    public head? : LinkedListNode<T>;
    public tail? : LinkedListNode<T>;
    private compare : Comparator<T>;

    constructor(comparatorFunction?: ComparatorFunction<T>) {
        /** @var LinkedListNode */
        this.head = undefined;

        /** @var LinkedListNode */
        this.tail = undefined;

        this.compare = new Comparator(comparatorFunction);
    }


    public prepend(value : T) {
        // Make new node to be a head.
        const newNode = new LinkedListNode(value, this.head);
        this.head = newNode;

        // If there is no tail yet let's make new node a tail.
        if (!this.tail) {
            this.tail = newNode;
        }

        return this;
    }

    public append(value : T) {
        const newNode = new LinkedListNode(value);

        // If there is no head yet let's make new node a head.
        if (!this.head || !this.tail) {
            this.head = newNode;
            this.tail = newNode;

            return this;
        }

        // Attach new node to the end of linked list.
        this.tail.next = newNode;
        this.tail = newNode;

        return this;
    }

    public delete(value : T) {
        if (!this.head || !this.tail) {
            return null;
        }

        let deletedNode = null;

        // If the head must be deleted then make next node that is differ
        // from the head to be a new head.
        while (this.head && this.compare.equal(this.head.value, value)) {
            deletedNode = this.head;
            this.head = this.head.next;
        }

        let currentNode = this.head;

        if (currentNode) {
            // If next node must be deleted then make next node to be a next next one.
            while (currentNode.next) {
                if (this.compare.equal(currentNode.next.value, value)) {
                    deletedNode = currentNode.next;
                    currentNode.next = currentNode.next.next;
                } else {
                    currentNode = currentNode.next;
                }
            }
        }

        // Check if tail must be deleted.
        if (this.compare.equal(this.tail.value, value)) {
            this.tail = currentNode;
        }

        return deletedNode;
    }

    public find(callback : (value : T) => boolean) : LinkedListNode<T> | undefined {
        if (!this.head) {
            return undefined;
        }

        let currentNode : LinkedListNode<T> | undefined = this.head;

        while (currentNode) {
            // If callback is specified then try to find node by callback.
            if (callback && callback(currentNode.value)) {
                return currentNode;
            }
            currentNode = currentNode.next;
        }

        return undefined;
    }


    public deleteTail() : LinkedListNode<T> | undefined {
        const deletedTail = this.tail;

        if (this.head === this.tail) {
            // There is only one node in linked list.
            this.head = undefined;
            this.tail = undefined;

            return deletedTail;
        }

        // If there are many nodes in linked list...

        // Rewind to the last node and delete "next" link for the node before the last one.
        let currentNode : LinkedListNode<T> | undefined = this.head;
        while (currentNode && currentNode.next) {
            if (!currentNode.next.next) {
                currentNode.next = undefined;
            } else {
                currentNode = currentNode.next;
            }
        }

        this.tail = currentNode;

        return deletedTail;
    }


    public deleteHead() : LinkedListNode<T> | undefined {
        if (!this.head) {
            return undefined;
        }

        const deletedHead = this.head;

        if (this.head.next) {
            this.head = this.head.next;
        } else {
            this.head = undefined;
            this.tail = undefined;
        }

        return deletedHead;
    }

    public fromArray(values : T[]) : LinkedList<T> {
        values.forEach(value => this.append(value));

        return this;
    }

  public toArray()  : LinkedListNode<T>[] {
        const nodes : LinkedListNode<T>[] = [];

        let currentNode = this.head;
        while (currentNode) {
            nodes.push(currentNode);
            currentNode = currentNode.next;
        }

        return nodes;
  }


    public toString(callback : (value : T) => string) {
        return this.toArray().map(node => node.toString(callback)).toString();
    }


    public reverse() : LinkedList<T> {
        let currNode = this.head;
        let prevNode = undefined;
        let nextNode = undefined;

        while (currNode) {
            // Store next node.
            nextNode = currNode.next;

            // Change next node of the current node so it would link to previous node.
            currNode.next = prevNode;

            // Move prevNode and currNode nodes one step forward.
            prevNode = currNode;
            currNode = nextNode;
        }

        // Reset head and tail.
        this.tail = this.head;
        this.head = prevNode;

        return this;
    }
}