<template>
  <svg ref="graphRef" class="forceGraph"></svg>
</template>

<script>
import { defineComponent, ref, onMounted } from 'vue';
import * as d3 from 'd3';
import * as cola from 'webcola';

const NODE_SIZE = 25;
const SMALL_CIRCLE_RADIUS = 3;
const DISTANCE_BETWEEN_SMALL_CIRCLES = 5;

export default defineComponent({
  name: 'ForceGraph',
  props: {
    data: {
      type: Object,
      required: true,
    },
    width: {
      type: Number,
      default: 500,
    },
    height: {
      type: Number,
      default: 500,
    },
  },
  setup(props, { emit }) {
    const graphRef = ref(null);
    const selectedNode = ref('');

    const unselectAllNodes = () => {
      emit('unselected');
      d3.selectAll('.node--selected').classed('node--selected', false);
      d3.selectAll('.node--selected-dependent').classed('node--selected-dependent', false);
      d3.selectAll('.link--selected').classed('link--selected', false);
      d3.selectAll('.node--greyed-out').classed('node--greyed-out', false);
      d3.selectAll('.link--greyed-out').classed('link--greyed-out', false);
      d3.selectAll('.circle--small').remove();
    };

    const getCirclePositionFactor = (index) => (index / NODE_SIZE)
        * (SMALL_CIRCLE_RADIUS / 2) * DISTANCE_BETWEEN_SMALL_CIRCLES;

    const drawCommunicationChannelCircles = () => {
      d3.selectAll('.node--selected-dependent')
        .append('g')
        .selectAll('.circle--small')
        .data((data) => data.dependencies.find(
          (dependency) => dependency.fullPath === selectedNode.value,
        ).usedProps)
        .enter()
        .append('circle')
        .attr('r', SMALL_CIRCLE_RADIUS)
        .attr('cx', (d, i) => NODE_SIZE * Math.cos(getCirclePositionFactor(i) - Math.PI * 0.5))
        .attr('cy', (d, i) => NODE_SIZE * Math.sin(getCirclePositionFactor(i) - Math.PI * 0.5))
        .attr('class', 'circle--small');
    };

    onMounted(() => {
      const nodes = props.data.nodes.map((d) => ({ ...d, id: d.fullPath }));
      const index = new Map(nodes.map((d) => [d.fullPath, d]));
      const links = props.data.links.map((d) => Object.assign(Object.create(d), {
        source: index.get(d.source),
        target: index.get(d.target),
      }));

      const svg = d3.select(graphRef.value)
        .attr('viewBox', [0, 0, props.width, props.height])
        .attr('class', 'svg')
        .on('click', () => {
          unselectAllNodes();
        });

      const g = svg.append('g');

      const layout = cola.d3adaptor(d3)
        .size([props.width, props.height])
        .nodes(nodes)
        .links(links)
        .flowLayout('y', 30)
        .avoidOverlaps(true)
        .symmetricDiffLinkLengths(20)
        .start(20, 20, 20);

      const link = g.append('g')
        .selectAll('line')
        .data(links)
        .enter()
        .append('line')
        .attr('id', (d) => `link-${d.source.index}-${d.target.index}`)
        .attr('class', 'link');

      const node = g.append('g')
        .selectAll('g')
        .data(nodes)
        .enter()
        .append('g')
        .attr('id', (d) => `node-${d.index}`)
        .attr('class', 'node')
        .call(layout.drag)
        .on('click', function (data) {
          d3.event.stopPropagation();
          unselectAllNodes();

          selectedNode.value = data.fullPath;

          // highlight selected node + dependents
          d3.select(this).classed('node--selected', true);
          const dependents = links.filter((l) => l.target.index === data.index);
          dependents.forEach((dependent) => {
            d3.select(`#node-${dependent.source.index}`).classed('node--selected-dependent', true);
            d3.select(`#link-${dependent.source.index}-${dependent.target.index}`).classed('link--selected', true);
          });
          drawCommunicationChannelCircles();

          // grey out everything else
          d3.selectAll('.node:not(.node--selected, .node--selected-dependent)').classed('node--greyed-out', true);
          d3.selectAll('.link:not(.link--selected').classed('link--greyed-out', true);

          emit('selected', data.fullPath);
        });

      node.append('circle')
        .attr('r', 20)
        .attr('class', 'circle');

      const label = node.append('g')
        .attr('dy', 2)
        .attr('dx', 0)
        .attr('class', 'label');

      label.append('text')
        .attr('dy', 2)
        .attr('dx', 0)
        .attr('class', 'label__text')
        .text((d) => d.name);

      label.insert('rect', '.label__text')
        .attr('fill', 'white')
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
    });

    return {
      graphRef,
    };
  },
});
</script>

<style lang="scss">
.svg {
    height: 100%;
    width: 100%;
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

    &--selected-dependent {
        .circle {
            stroke: var(--grey-50);
        }
    }

    &--greyed-out {
        opacity: 50%;
        .circle {
            stroke: none;
        }

        .label__text {
            fill: var(--grey-20);
        }
    }
}

.link {
    stroke: var(--grey-20);

    &--selected {
        stroke: var(--grey-50);
    }

    &--greyed-out {
       stroke: var(--grey-15);
    }
}

.circle {
    fill: white;
    stroke: var(--grey-20);
    stroke-width: 1px;
    cursor: pointer;

    transition: fill 200ms;

    &--small {
        fill: var(--mint-grey);
        stroke: var(--mint-50);
    }
}

.label {
    cursor: pointer;

    &__text {
        font-size: var(--font-size--xs);
        fill: var(--navy-90);
        transition: fill 200ms;
    }

    &__background {
        fill: white;
        rx: var(--border-radius--xs);
        transition: fill 200ms;
    }
}
</style>
