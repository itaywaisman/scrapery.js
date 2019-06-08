import { Graph } from "./Graph";
import { Stack } from "./Stack";
import { GraphVertex } from "./GraphVertex";
import { depthFirstSearch } from "./depthFirstSearch";

export function topologicalSort<T>(graph : Graph<T>) {
    // Create a set of all vertices we want to visit.
    let unvisitedSet : {[key: string] : any} = {};
    graph.getAllVertices().forEach((vertex) => {
        unvisitedSet[vertex.getKey()] = vertex;
    });
  
    // Create a set for all vertices that we've already visited.
    let visitedSet : {[key: string] : any} = {};
  
    // Create a stack of already ordered vertices.
    let sortedStack = new Stack<GraphVertex<T>>();
  
    let dfsCallbacks = {
        enterVertex: (currentVertex: GraphVertex<any>) => {
            // Add vertex to visited set in case if all its children has been explored.
            visitedSet[currentVertex.getKey()] = currentVertex;

            // Remove this vertex from unvisited set.
            delete unvisitedSet[currentVertex.getKey()];
        },
        leaveVertex: (currentVertex: GraphVertex<any>) => {
            // If the vertex has been totally explored then we may push it to stack.
            sortedStack.push(currentVertex);
        },
        allowTraversal: (nextVertex: GraphVertex<any> | null) => {
            return !!nextVertex && !visitedSet[nextVertex.getKey()];
        },
    };
  
    // Let's go and do DFS for all unvisited nodes.
    while (Object.keys(unvisitedSet).length) {
        const currentVertexKey = Object.keys(unvisitedSet)[0];
        const currentVertex = unvisitedSet[currentVertexKey];
    
        // Do DFS for current node.
        depthFirstSearch(graph, currentVertex, dfsCallbacks);
    }
  
    return sortedStack.toArray();
}