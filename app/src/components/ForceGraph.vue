<template>
  <div ref="graphRef"></div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import * as d3 from 'd3';

interface SimNode extends d3.SimulationNodeDatum {
    id: string;
    group: number;
    r: number;
}

interface SimLink extends d3.SimulationLinkDatum<SimNode> {
  source: string;
  target: string;
    value: number;
    d: number;
    s: number;
}

interface Graph {
    nodes: SimNode[];
    links: SimLink[];
}

export default defineComponent({
  name: 'ForceGraph',
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const graphRef = ref(null);

    onMounted(() => {
      // eslint-disable-next-line max-len
      const simulation: d3.Simulation<SimNode, SimLink> = d3.forceSimulation<SimNode>(props.data.nodes);

      let forceCharge: d3.ForceManyBody<SimNode>;
      forceCharge = d3.forceManyBody<SimNode>();
      forceCharge = forceCharge.strength(-10);
      simulation
        .force('charge', forceCharge);
      simulation
        .force('link', d3.forceLink<SimNode, SimLink>(props.data.links).id((d) => d.id).distance(50))
        .force('center', d3.forceCenter(150, 150));

      const svg = d3.select(graphRef.value)
        .append('svg')
        .attr('viewBox', [0, 0, 300, 300])
        .attr('class', 'svg');

      const link = svg.selectAll('path.link')
        .data(props.data.links)
        .enter()
        .append('path')
        .attr('class', 'link');

      const node = svg.selectAll('.node')
        .data(props.data.nodes)
        .enter()
        .append('g')
        .attr('class', 'node')
        .style('text-anchor', 'middle');

      node.append('circle')
        .attr('r', 10)
        .attr('class', 'circle');

      node.append('text')
        .attr('dy', 2)
        .attr('dx', 0)
        .attr('class', 'label')
        .text((d) => d.title);

      const drag = (sim: d3.Simulation<SimNode, SimLink>) => {
        const dragstarted = (event: d3.D3DragEvent<Element, SimNode, any>) => {
          if (!event.active) sim.alphaTarget(0.3).restart();
          // eslint-disable-next-line no-param-reassign
          event.subject.fx = event.subject.x;
          // eslint-disable-next-line no-param-reassign
          event.subject.fy = event.subject.y;
        };

        const dragged = (event: d3.D3DragEvent<Element, SimNode, any>) => {
          // eslint-disable-next-line no-param-reassign
          event.subject.fx = event.x;
          // eslint-disable-next-line no-param-reassign
          event.subject.fy = event.y;
        };

        const dragended = (event: d3.D3DragEvent<Element, SimNode, any>) => {
          if (!event.active) sim.alphaTarget(0);
          // eslint-disable-next-line no-param-reassign
          event.subject.fx = null;
          // eslint-disable-next-line no-param-reassign
          event.subject.fy = null;
        };

        return d3.drag<Element, SimNode>()
          .on('start', dragstarted)
          .on('drag', dragged)
          .on('end', dragended);
      };

      node.call(drag(simulation));

      simulation.on('tick', () => {
        node.attr('transform', (d) => `translate(${d.x},${d.y})`);
        link.attr('d', (d) => d3.line()([
          [d.source.x, d.source.y],
          [d.target.x, d.target.y]]));
      });
    });

    return {
      graphRef,
    };
  },
});
</script>

<style>
.svg {
  width: 50vw;
}

.link {
  stroke: lightgray;
}

.circle {
  fill: #bbe8f2;
  stroke: #97c6d1;
  stroke-width: 1px;
  cursor: grab;
}

.circle--small {
  fill: #62acbd;
}

.label {
  font-family: sans-serif;
  font-size: 0.4rem;
  fill: #4f4f4f;
  cursor: grab;
}
</style>
