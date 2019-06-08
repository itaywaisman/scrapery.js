import LinkedList from './LinkedList';
import GraphEdge from './GraphEdge';
import { LinkedListNode } from './LinkedListNode';

export class GraphVertex<T> {
  
    public key : string;
    public value : T;
    public edges: LinkedList<GraphEdge<T>>;

    constructor(key: string, value: T) {
        if (key === undefined || value === undefined) {
            throw new Error('Graph vertex must have a value');
        }

        const edgeComparator = (edgeA: GraphEdge<T>, edgeB: GraphEdge<T>) => {
            if (edgeA.getKey() === edgeB.getKey()) {
                return 0;
            }

            return edgeA.getKey() < edgeB.getKey() ? -1 : 1;
        };

        this.key = key;
        this.value = value;
        this.edges = new LinkedList(edgeComparator);
    }

    public addEdge(edge : GraphEdge<T>) {
        this.edges.append(edge);

        return this;
    }

    public deleteEdge(edge: GraphEdge<T>) {
        this.edges.delete(edge);
    }

    public getNeighbors() : GraphVertex<T>[]{
        const edges = this.edges.toArray();

        return edges.map((node : LinkedListNode<GraphEdge<T>>) => {
            return node.value.startVertex === this ? node.value.endVertex : node.value.startVertex;
        });
    }

    public getEdges() : GraphEdge<T>[] {
        return this.edges.toArray().map(linkedListNode => linkedListNode.value);
    }

    public getDegree() : number {
        return this.edges.toArray().length;
    }

    public hasEdge(requiredEdge : GraphEdge<T>) :boolean {
        const edgeNode = this.edges.find(
            edge => edge === requiredEdge,
        );

        return !!edgeNode;
    }

    public hasNeighbor(vertex : GraphVertex<T>) : boolean{
        const vertexNode = this.edges.find(
            edge => edge.startVertex === vertex || edge.endVertex === vertex,
        );

        return !!vertexNode;
    }

    public findEdge(vertex: GraphVertex<T>) {
        const edgeFinder = (edge: GraphEdge<T>) => {
            return edge.startVertex === vertex || edge.endVertex === vertex;
        };

        const edge = this.edges.find( edgeFinder);

        return edge ? edge.value : null;
    }

    public getKey() {
        return this.key;
    }

    public deleteAllEdges() {
        this.getEdges().forEach(edge => this.deleteEdge(edge));

        return this;
    }

}