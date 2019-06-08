import { Graph } from "./Graph";
import { GraphVertex } from "./GraphVertex";


export type DFSCallbacks<T> = {
    enterVertex: (currentVertex: GraphVertex<T>, previousVertex: GraphVertex<T> | null) => void,
    leaveVertex: (currentVertex: GraphVertex<T>, previousVertex?: GraphVertex<T> | null) => void,
    allowTraversal: (nextVertex: GraphVertex<T> | null, currentVertex?: GraphVertex<T>, previousVertex?: GraphVertex<T>) => boolean,
  };

function initCallbacks<T>(callbacks?: DFSCallbacks<T>) : DFSCallbacks<T>{
    const stubCallback = () => {};

    const allowTraversalCallback = (
        () => {
            const seen : { [key: string] : boolean } = {};
            return (nextVertex : GraphVertex<T> | null) => {
                if (nextVertex && !seen[nextVertex.getKey()]) {
                    seen[nextVertex.getKey()] = true;
                    return true;
                }
                return false;
            };
        }
    )();

    const initiatedCallback = {
        allowTraversal : callbacks ? callbacks.allowTraversal : allowTraversalCallback,
        enterVertex : callbacks ? callbacks.enterVertex : stubCallback,
        leaveVertex : callbacks ? callbacks.leaveVertex : stubCallback
    };



    return initiatedCallback;
}

function depthFirstSearchRecursive<T>(graph : Graph<T>, currentVertex: GraphVertex<T>, previousVertex: GraphVertex<T> | null, callbacks: DFSCallbacks<T>) {
    callbacks.enterVertex(currentVertex, previousVertex);

    graph.getNeighbors(currentVertex).forEach((nextVertex) => {
        if (callbacks.allowTraversal(previousVertex, currentVertex, nextVertex)) {
        depthFirstSearchRecursive(graph, nextVertex, currentVertex, callbacks);
        }
    });

    callbacks.leaveVertex(currentVertex, previousVertex);
}
  
export function depthFirstSearch<T>(graph : Graph<T>, startVertex : GraphVertex<T>, callbacks: DFSCallbacks<T>) {
    const previousVertex = null;
    depthFirstSearchRecursive(graph, startVertex, previousVertex, initCallbacks(callbacks));
}