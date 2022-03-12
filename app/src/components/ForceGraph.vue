<template>
  <svg ref="graphRef" class="forceGraph"></svg>
</template>

<script>
import {
  defineComponent, ref, onMounted, watch,
} from 'vue';
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
    selectedComponent: {
      type: Object,
      default: null,
    },
    selectedChannel: {
      type: Object,
      default: null,
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

    const resetChannelSelection = () => {
      d3.selectAll('.node--usesChannel').classed('node--usesChannel', false);
      d3.selectAll('.node__channel--selected').classed('node__channel--selected', false);
    };

    const resetNodeSelection = () => {
      emit('unselected');
      d3.selectAll('.node--selected').classed('node--selected', false);
      d3.selectAll('.node--selectedDependent').classed('node--selectedDependent', false);
      d3.selectAll('.link--selected').classed('link--selected', false);
      d3.selectAll('.node--greyedOut').classed('node--greyedOut', false);
      d3.selectAll('.link--greyedOut').classed('link--greyedOut', false);
      d3.selectAll('.node__channel').remove();
      resetChannelSelection();
    };

    const getCirclePositionFactor = (index) => (index / NODE_SIZE)
        * (SMALL_CIRCLE_RADIUS / 2) * DISTANCE_BETWEEN_SMALL_CIRCLES;

    const drawCommunicationChannelCircles = () => {
      d3.selectAll('.node--selectedDependent')
        .append('g')
        .selectAll('.node__channel')
        .data((data) => data.dependencies.find(
          (dependency) => dependency.fullPath === selectedNode.value,
        ).usedProps)
        .enter()
        .append('circle')
        .attr('r', SMALL_CIRCLE_RADIUS)
        .attr('cx', (d, i) => NODE_SIZE * Math.cos(getCirclePositionFactor(i) - Math.PI * 0.5))
        .attr('cy', (d, i) => NODE_SIZE * Math.sin(getCirclePositionFactor(i) - Math.PI * 0.5))
        .attr('class', 'node__channel');
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
          resetNodeSelection();
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
      // eslint-disable-next-line func-names
        .on('click', function (data) {
          d3.event.stopPropagation();
          resetNodeSelection();

          selectedNode.value = data.fullPath;

          // highlight selected node + dependents
          d3.select(this).classed('node--selected', true);
          const dependents = links.filter((l) => l.target.index === data.index);
          dependents.forEach((dependent) => {
            d3.select(`#node-${dependent.source.index}`).classed('node--selectedDependent', true);
            d3.select(`#link-${dependent.source.index}-${dependent.target.index}`).classed('link--selected', true);
          });
          drawCommunicationChannelCircles();

          // grey out everything else
          d3.selectAll('.node:not(.node--selected, .node--selectedDependent)').classed('node--greyedOut', true);
          d3.selectAll('.link:not(.link--selected').classed('link--greyedOut', true);

          emit('selected', data.fullPath);
        });

      node.append('circle')
        .attr('r', 20)
        .attr('class', 'node__circle');

      const label = node.append('g')
        .attr('dy', 2)
        .attr('dx', 0)
        .attr('class', 'node__label');

      label.append('text')
        .attr('dy', 2)
        .attr('dx', 0)
        .attr('class', 'node__labelText')
        .text((d) => d.name);

      label.insert('rect', '.node__labelText')
        .attr('fill', 'white')
      // eslint-disable-next-line func-names
        .attr('width', function () {
          const bbox = d3.select(this.parentNode).select('.node__labelText').node().getBBox();
          return bbox.width + 2;
        })
      // eslint-disable-next-line func-names
        .attr('height', function () {
          const bbox = d3.select(this.parentNode).select('.node__labelText').node().getBBox();
          return bbox.height;
        })
      // eslint-disable-next-line func-names
        .attr('x', function () {
          const bbox = d3.select(this.parentNode).select('.node__labelText').node().getBBox();
          return bbox.x - 1;
        })
      // eslint-disable-next-line func-names
        .attr('y', function () {
          const bbox = d3.select(this.parentNode).select('.node__labelText').node().getBBox();
          return bbox.y;
        })
        .attr('class', 'node__labelBackground');

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

    const highlightChannelUsage = (channel) => {
      d3.selectAll('.node--selectedDependent')
        .classed('node--usesChannel', (d) => {
          const dependency = d.dependencies.find(
            (dep) => dep.fullPath === props.selectedComponent.fullPath,
          );
          return dependency.usedProps.some(
            (prop) => props.selectedComponent.props[prop].name === channel.name,
          );
        });

      d3.selectAll('.node--selectedDependent .node__channel')
        .classed('node__channel--selected', (d) => props.selectedComponent.props[d].name === channel.name);
    };

    watch(() => props.selectedChannel, () => {
      resetChannelSelection();
      highlightChannelUsage(props.selectedChannel);
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

    &__circle {
        fill: white;
        stroke: var(--grey-20);
    }

    &__label {
        cursor: pointer;
    }

    &__labelText {
        font-size: var(--font-size--2xs);
        fill: var(--navy-90);
    }

    &__labelBackground {
        fill: white;
        rx: var(--border-radius--xs);
    }

    &__channel {
        fill: var(--mint-grey);
        stroke: var(--mint-50);

        &--selected {
            fill: var(--mint-50);
            stroke: var(--mint-70);
        }
    }

    &__circle,
    &__channel {
        stroke-width: 1px;
        cursor: pointer;
    }

    &__circle,
    &__channel,
    &__labelText,
    &__labelBackground {
        transition: fill 200ms;
    }

    &--selected {
        .node__circle,
        .node__labelBackground {
            fill: var(--yellow-30);
        }

        .node__circle {
            stroke: var(--yellow-50);
        }
    }

    &--selectedDependent {
        .node__circle {
            stroke: var(--grey-50);
        }
    }

    &--usesChannel {
        .node__circle,
        .node__labelBackground {
            fill: var(--mint-30);
        }

        .node__circle {
            stroke: var(--mint-50);
        }
    }

    &--greyedOut {
        opacity: 50%;
        .node__circle {
            stroke: none;
        }

        .node__labelText {
            fill: var(--grey-20);
        }
    }
}

.link {
    stroke: var(--grey-20);

    &--selected {
        stroke: var(--grey-50);
    }

    &--greyedOut {
       stroke: var(--grey-15);
    }
}
</style>
