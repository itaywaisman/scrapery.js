import { IStep } from "./interfaces/step.interface";
import { Graph } from "./utils/Graph";
import { GraphVertex } from "./utils/GraphVertex";
import GraphEdge from "./utils/GraphEdge";
import { topologicalSort } from "./utils/topologicalSort";

export type StepWithParameters = {
    step: IStep,
    parameters?: any
}

export interface IFlow {
    steps: { [id : string] : { step: IStep, parameters?: any}},
    edges: {fromId: string, toId: string}[]
}

export class FlowRunner {

    constructor(private stepToOptions : {[stepId: string] : any} = {}) {}

    public async runFlow(flow: IFlow) : Promise<void> {
        let graph = this.buildGraph(flow);
        let sortedGraph = topologicalSort(graph).reverse();

        let stepResultsMap : {[stepId : string] : any} = {};

        for (const stepVertex of sortedGraph) {
            stepVertex.value.step.init(this.stepToOptions[stepVertex.getKey()]);
            let enteringNeighbours = this.findEnteringNeighbours(graph, stepVertex);
            let inputData: any = {};
            if(enteringNeighbours.length == 1) {
                inputData = stepResultsMap[enteringNeighbours[0].getKey()];
            } else {
                let resultsMapping : {[key: string] : any} = {};
                for (const key of enteringNeighbours.map(v => v.getKey())) {
                    resultsMapping[key] = stepResultsMap[key];
                }
                inputData = resultsMapping;
            }
            stepResultsMap[stepVertex.getKey()] = 
                await stepVertex.value.step.execute(inputData, stepVertex.value.parameters);
        }
    }

    private buildGraph(flow: IFlow) : Graph<StepWithParameters> {
        let graph = new Graph<StepWithParameters>(true);
        for (const stepKey in flow.steps) {
            if (flow.steps.hasOwnProperty(stepKey)) {
                const step = flow.steps[stepKey];
                graph.addVertex(new GraphVertex<StepWithParameters>(stepKey, step));
            }
        }

        for (const edge of flow.edges) {
            let fromVertex = graph.getVertexByKey(edge.fromId);
            let toVertex = graph.getVertexByKey(edge.toId);
            graph.addEdge(new GraphEdge<StepWithParameters>(fromVertex, toVertex));
        }

        return graph;
    }

    private findEnteringNeighbours(graph: Graph<StepWithParameters>, vertex: GraphVertex<StepWithParameters>) {
        let allEdges = graph.getAllEdges();
        let enteringEdges = allEdges.filter(edge => edge.endVertex === vertex);
        let enteringNeighbours = enteringEdges.map(edge => edge.startVertex);

        return enteringNeighbours;
    }
   
}