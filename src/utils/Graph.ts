import { GraphVertex } from "./GraphVertex";
import GraphEdge from "./GraphEdge";

export class Graph<T> {
    public vertices : {[key: string] : GraphVertex<T>};
    public edges : {[key: string] : GraphEdge<T>}
    public isDirected:  boolean;

    constructor(isDirected = false) {
        this.vertices = {};
        this.edges = {};
        this.isDirected = isDirected;
    }

    public addVertex(newVertex: GraphVertex<T>) {
        this.vertices[newVertex.getKey()] = newVertex;
    
        return this;
    }

    public getVertexByKey(vertexKey: string) {
        return this.vertices[vertexKey];
    }

    public getNeighbors(vertex: GraphVertex<T>) : GraphVertex<T>[] {
        return vertex.getNeighbors();
    }

    public getAllVertices() : GraphVertex<T>[] {
        return Object.values(this.vertices);
    }
  
    public getAllEdges() : GraphEdge<T>[]{
        return Object.values(this.edges);
    }
  

    public addEdge(edge: GraphEdge<T>) {
        // Try to find and end start vertices.
        let startVertex = this.getVertexByKey(edge.startVertex.getKey());
        let endVertex = this.getVertexByKey(edge.endVertex.getKey());
    
        // Insert start vertex if it wasn't inserted.
        if (!startVertex) {
            this.addVertex(edge.startVertex);
            startVertex = this.getVertexByKey(edge.startVertex.getKey());
        }
    
        // Insert end vertex if it wasn't inserted.
        if (!endVertex) {
            this.addVertex(edge.endVertex);
            endVertex = this.getVertexByKey(edge.endVertex.getKey());
        }
    
        // Check if edge has been already added.
        if (this.edges[edge.getKey()]) {
            throw new Error('Edge has already been added before');
        } else {
            this.edges[edge.getKey()] = edge;
        }
    
        // Add edge to the vertices.
        if (this.isDirected) {
            // If graph IS directed then add the edge only to start vertex.
            startVertex.addEdge(edge);
        } else {
            // If graph ISN'T directed then add the edge to both vertices.
            startVertex.addEdge(edge);
            endVertex.addEdge(edge);
        }
    
        return this;
    }

    public deleteEdge(edge: GraphEdge<T>) {
        // Delete edge from the list of edges.
        if (this.edges[edge.getKey()]) {
            delete this.edges[edge.getKey()];
        } else {
            throw new Error('Edge not found in graph');
        }
    
        // Try to find and end start vertices and delete edge from them.
        const startVertex = this.getVertexByKey(edge.startVertex.getKey());
        const endVertex = this.getVertexByKey(edge.endVertex.getKey());
    
        startVertex.deleteEdge(edge);
        endVertex.deleteEdge(edge);
    }
  
    public findEdge(startVertex: GraphVertex<T>, endVertex: GraphVertex<T>) {
        const vertex = this.getVertexByKey(startVertex.getKey());
    
        if (!vertex) {
            return null;
        }
    
        return vertex.findEdge(endVertex);
    }

    public getWeight() {
        return this.getAllEdges().reduce((weight, graphEdge) => {
            return weight + graphEdge.weight;
        }, 0);
    }
  
    
    public reverse() {
      
      this.getAllEdges().forEach((edge) => {
        // Delete straight edge from graph and from vertices.
        this.deleteEdge(edge);
  
        // Reverse the edge.
        edge.reverse();
  
        // Add reversed edge back to the graph and its vertices.
        this.addEdge(edge);
      });
  
      return this;
    }
  
    /**
     * @return {object}
     */
    public getVerticesIndices() :  {[key: string] : number} {
      const verticesIndices : {[key: string] : number} = {};
      this.getAllVertices().forEach((vertex, index) => {
        verticesIndices[vertex.getKey()] = index;
      });
  
      return verticesIndices;
    }
  
    public getAdjacencyMatrix() {
        const vertices = this.getAllVertices();
        const verticesIndices = this.getVerticesIndices();
    
        // Init matrix with infinities meaning that there is no ways of
        // getting from one vertex to another yet.
        const adjacencyMatrix = Array(vertices.length).fill(null).map(() => {
            return Array(vertices.length).fill(Infinity);
        });
    
        // Fill the columns.
        vertices.forEach((vertex, vertexIndex) => {
            vertex.getNeighbors().forEach((neighbor) => {
                const neighborIndex = verticesIndices[neighbor.getKey()];
                let edge = this.findEdge(vertex, neighbor);
                adjacencyMatrix[vertexIndex][neighborIndex] = edge? edge.weight : 0;
            });
        });
    
        return adjacencyMatrix;
    }

  }