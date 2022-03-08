<template>
  <div ref="graphRef"></div>
</template>

<script>
import { defineComponent, ref, onMounted } from 'vue';
import * as d3 from 'd3';
import * as cola from 'webcola';

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
    const width = 800;
    const height = 400;

    onMounted(() => {
      const nodes = props.data.nodes.map((d) => Object.create(d));
      const index = new Map(nodes.map((d) => [d.id, d]));
      const links = props.data.links.map((d) => Object.assign(Object.create(d), {
        source: index.get(d.source),
        target: index.get(d.target),
      }));

      const svg = d3.select(graphRef.value)
        .append('svg')
        .attr('viewBox', [0, 0, width, height])
        .attr('class', 'svg');

      const g = svg.append('g');

      const layout = cola.d3adaptor(d3)
        .size([width, height])
        .nodes(nodes)
        .links(links)
        .flowLayout('y', 30)
        .avoidOverlaps(true)
        .symmetricDiffLinkLengths(20)
        .start(20, 20, 20);

      const link = g.append('g')
        .attr('stroke', '#999')
        .attr('stroke-opacity', 0.6)
        .selectAll('line')
        .data(links)
        .enter()
        .append('line')
        .attr('class', 'link');

      let selectedNode = null;

      const node = g.append('g')
        .selectAll('g')
        .data(nodes)
        .enter()
        .append('g')
        .attr('class', 'node')
        .call(layout.drag)
        .on('click', function () {
          if (selectedNode) selectedNode.classed('node--selected', false);
          selectedNode = d3.select(this).classed('node--selected', true);
        });

      node.append('circle')
        .attr('r', 15)
        .attr('class', 'circle');

      const label = node.append('g')
        .attr('dy', 2)
        .attr('dx', 0)
        .attr('class', 'label');

      label.append('text')
        .attr('dy', 2)
        .attr('dx', 0)
        .attr('class', 'label__text')
        .text((d) => d.title);

      label.insert('rect', '.label__text')
        .attr('width', function () {
          const bbox = d3.select(this.parentNode).select('.label__text').node().getBBox();
          return bbox.width + 2;
        })
        .attr('height', function () {
          const bbox = d3.select(this.parentNode).select('.label__text').node().getBBox();
          return bbox.height;
        })
        .attr('x', function () {
          const bbox = d3.select(this.parentNode).select('.label__text').node().getBBox();
          return bbox.x - 1;
        })
        .attr('y', function () {
          const bbox = d3.select(this.parentNode).select('.label__text').node().getBBox();
          return bbox.y;
        })
        .attr('class', 'label__background');

      layout.on('tick', () => {
        link
          .attr('x1', (d) => d.source.x)
          .attr('y1', (d) => d.source.y)
          .attr('x2', (d) => d.target.x)
          .attr('y2', (d) => d.target.y);

        node.attr('transform', (d) => `translate(${d.x},${d.y})`);
      });

      function zoomed() {
        g.attr('transform', d3.event.transform);
      }

      const zoom = d3.zoom()
        .scaleExtent([0.4, 8])
        .on('zoom', zoomed);

      svg.call(zoom);

      return svg.node();
    });

    return {
      graphRef,
    };
  },
});
</script>

<style lang="scss">
.svg {
    width: 100vw;
    height: 70vh;
    background: var(--grey-10);
    cursor: grab;
}

.node {
    text-anchor: middle;

    &--selected {
        .circle,
        .label__background {
            fill: var(--yellow-30);
        }

        .circle {
            stroke: var(--yellow-50);
        }
    }
}

.link {
    stroke: var(--grey-20);
}

.circle {
    fill: white;
    stroke: var(--grey-20);
    stroke-width: 1px;
    cursor: pointer;
}

.circle--small {
    fill: #62acbd;
}

.label {
    cursor: pointer;

    &__text {
        font-size: var(--font-size--xs);
        fill: var(--navy-90);
    }

    &__background {
        fill: white;
        rx: 2px;
    }
}
</style>
