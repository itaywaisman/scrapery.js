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
        let sortedGraph = topologicalSort(graph);

        let stepResultsMap : {[stepId : string] : any} = {};

        for (const stepVertex of sortedGraph) {
            stepVertex.value.step.init(this.stepToOptions[stepVertex.getKey()]);
            //TODO: pass previous results to current step
            stepResultsMap[stepVertex.getKey()] = stepVertex.value.step.execute(null, stepVertex.value.parameters);
        }
    }

    private buildGraph(flow: IFlow) : Graph<StepWithParameters> {
        let graph = new Graph<{ step: IStep, parameters?: any}>(true);
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

   
}