<template>
  <svg ref="graphRef" class="forceGraph"></svg>
</template>

<script>
import {
  defineComponent, ref, onMounted, watch, computed,
} from 'vue';
import * as d3 from 'd3';
import * as cola from 'webcola';

const SMALL_CIRCLE_RADIUS = 3;
const DISTANCE_BETWEEN_SMALL_CIRCLES = 6;
const NODE_SIZE_NO_FILTER = 15;

export default defineComponent({
  name: 'ForceGraph',
  props: {
    data: {
      type: Object,
      required: true,
    },
    selectedChannelType: {
      type: String,
      default: null,
    },
    selectedComponent: {
      type: Object,
      default: null,
    },
    selectedChannel: {
      type: Object,
      default: null,
    },
    nodeSizeAttribute: {
      type: String,
      default: 'props',
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
    const transitionTime = null;

    const nodes = props.data.nodes.map((d) => ({ ...d, id: d.fullPath }));
    const indices = new Map(nodes.map((d) => [d.fullPath, d]));
    const links = props.data.links.map((d) => Object.assign(Object.create(d), {
      source: indices.get(d.source),
      target: indices.get(d.target),
    }));

    const nodeSizeAttributeScale = computed(() => {
      if (props.nodeSizeAttribute === 'none') return (d) => d;

      const numbersOfAttribute = props.nodeSizeAttribute === 'all'
        ? nodes.map((d) => d.props.length + d.events.length + d.slots.length)
        : nodes.map((d) => d[props.nodeSizeAttribute].length);
      return d3.scaleLinear(d3.extent(numbersOfAttribute), [10, 30]);
    });

    const calculateNodeSize = (d) => {
      if (props.nodeSizeAttribute === 'none') return NODE_SIZE_NO_FILTER;

      const value = props.nodeSizeAttribute === 'all'
        ? d.props.length + d.events.length + d.slots.length : d[props.nodeSizeAttribute].length;
      return nodeSizeAttributeScale.value(value);
    };

    const updateNodeSize = () => {
      d3.selectAll('.node__circle')
        .transition(transitionTime)
        .attr('r', (d) => calculateNodeSize(d));
    };

    const getCirclePositionFactor = (index, nodeSize) => (index / nodeSize)
          * (SMALL_CIRCLE_RADIUS / 2) * DISTANCE_BETWEEN_SMALL_CIRCLES;

    const updateCommunicationChannelPositions = () => {
      const nodeSize = d3.local();
      d3.selectAll('.node--selectedDependent')
        .each((d, i, currentNodes) => nodeSize.set(currentNodes[i], calculateNodeSize(d)))
        .selectAll('.node__channel')
        .transition(transitionTime)
        .attr('cx', (d, i, currentNodes) => {
          const channelCircleRadius = nodeSize.get(currentNodes[i]) + 5;
          return channelCircleRadius * Math.cos(getCirclePositionFactor(i, channelCircleRadius) - Math.PI * 0.5);
        })
        .attr('cy', (d, i, currentNodes) => {
          const channelCircleRadius = nodeSize.get(currentNodes[i]) + 5;
          return channelCircleRadius * Math.sin(getCirclePositionFactor(i, channelCircleRadius) - Math.PI * 0.5);
        });
    };

    const drawCommunicationChannelCircles = () => {
      d3.selectAll('.node--selectedDependent')
        .append('g')
        .selectAll('.node__channel')
        .data((data) => data.dependencies.find(
          (dependency) => dependency.fullPath === selectedNode.value,
        )[`used${props.selectedChannelType}`])
        .enter()
        .append('circle')
        .attr('r', SMALL_CIRCLE_RADIUS)
        .attr('class', `node__channel node__channel--${props.selectedChannelType.toLowerCase()}`);

      updateCommunicationChannelPositions();
    };

    const resetChannelSelection = () => {
      d3.selectAll('.node--usesProps').classed('node--usesProps', false);
      d3.selectAll('.node--usesEvents').classed('node--usesEvents', false);
      d3.selectAll('.node--usesSlots').classed('node--usesSlots', false);
      d3.selectAll('.node__channel--selected').classed('node__channel--selected', false);
    };

    const removeNodeChannels = () => {
      d3.selectAll('.node__channel').remove();
      d3.selectAll('.node__channel--props').remove();
      d3.selectAll('.node__channel--slots').remove();
      d3.selectAll('.node__channel--events').remove();
    };

    const resetNodeSelection = () => {
      emit('unselected');
      d3.selectAll('.node--selected').classed('node--selected', false);
      d3.selectAll('.node--selectedDependent').classed('node--selectedDependent', false);
      d3.selectAll('.link--selected').classed('link--selected', false);
      d3.selectAll('.node--greyedOut').classed('node--greyedOut', false);
      d3.selectAll('.link--greyedOut').classed('link--greyedOut', false);
      removeNodeChannels();
      resetChannelSelection();
    };

    onMounted(() => {
      const svg = d3.select(graphRef.value)
        .attr('viewBox', [0, 0, props.width, props.height])
        .attr('class', 'svg')
        .on('click', () => {
          resetNodeSelection();
        });

      svg.transition().duration(500);

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
        .attr('class', 'node__circle');

      updateNodeSize();

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
        .classed(`node--uses${props.selectedChannelType}`, (d) => {
          const dependency = d.dependencies.find(
            (dep) => dep.fullPath === props.selectedComponent.fullPath,
          );
          const channels = props.selectedComponent[props.selectedChannelType.toLowerCase()];
          return dependency[`used${props.selectedChannelType}`].some((prop) => channels[prop].name === channel.name);
        });

      d3.selectAll(`.node--selectedDependent .node__channel--${props.selectedChannelType.toLowerCase()}`)
        .classed('node__channel--selected',
          (d) => props.selectedComponent[props.selectedChannelType.toLowerCase()][d].name === channel.name);
    };

    watch(() => props.nodeSizeAttribute, () => {
      updateNodeSize();
      updateCommunicationChannelPositions();
    });

    watch(() => props.selectedChannel, () => {
      resetChannelSelection();
      highlightChannelUsage(props.selectedChannel);
    });

    watch(() => props.selectedChannelType, () => {
      removeNodeChannels();
      resetChannelSelection();
      drawCommunicationChannelCircles();
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

        &--props {
            fill: var(--mint-grey);
            stroke: var(--mint-50);
        }

        &--events {
            fill: var(--red-grey);
            stroke: var(--red-50);
        }

        &--slots {
            fill: var(--purple-grey);
            stroke: var(--purple-50);
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

    &--usesProps {
        .node__circle,
        .node__labelBackground {
            fill: var(--mint-30);
        }

        .node__circle {
            stroke: var(--mint-50);
        }

        .node__channel--selected {
            fill: var(--mint-50);
            stroke: var(--mint-70);
        }
    }

    &--usesSlots {
        .node__circle,
        .node__labelBackground {
            fill: var(--purple-30);
        }

        .node__circle {
            stroke: var(--purple-50);
        }

        .node__channel--selected {
            fill: var(--purple-50);
            stroke: var(--purple-70);
        }
    }

    &--usesEvents {
        .node__circle,
        .node__labelBackground {
            fill: var(--red-30);
        }

        .node__circle {
            stroke: var(--red-50);
        }

        .node__channel--selected {
            fill: var(--red-50);
            stroke: var(--red-70);
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
