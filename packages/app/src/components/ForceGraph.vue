<template>
  <transition name="fade">
    <BaseTooltip
      v-if="showTooltip"
      :position-x="tooltipPositionX"
      :position-y="tooltipPositionY"
    >
      {{ tooltipContent }}
    </BaseTooltip>
  </transition>
  <svg ref="graphRef" class="forceGraph"></svg>
</template>

<script>
import {
  defineComponent, ref, onMounted, watch, computed,
} from 'vue';
import * as d3 from 'd3';
import * as cola from 'webcola';
import BaseTooltip from '@/components/base/BaseTooltip.vue';
import useSelection from '@/hooks/useSelection';
import nodeSizeAttributeType from '@/types/nodeSizeAttributeType';

const SMALL_CIRCLE_RADIUS = 2;
const DISTANCE_BETWEEN_SMALL_CIRCLES = 5;
const NODE_SIZE_NO_FILTER = 15;

export default defineComponent({
  name: 'ForceGraph',
  components: { BaseTooltip },
  props: {
    data: {
      type: Object,
      required: true,
    },
    nodeSizeAttribute: {
      type: String,
      default: 'props',
    },
    searchString: {
      type: String,
      default: '',
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
  setup(props) {
    const showTooltip = ref(false);
    const tooltipContent = ref('test');
    const tooltipPositionX = ref(0);
    const tooltipPositionY = ref(0);

    const {
      selectedComponent,
      selectedChannel,
      selectedChannelType,
      updateSelectedComponent,
      updateSelectedChannel,
    } = useSelection();

    const graphRef = ref(null);
    const transitionTime = null;

    const nodes = props.data.nodes.map((d) => ({ ...d, id: d.fullPath }));
    const indices = new Map(nodes.map((d) => [d.fullPath, d]));
    const links = props.data.links.map((d) => Object.assign(Object.create(d), {
      source: indices.get(d.source),
      target: indices.get(d.target),
    }));

    const nodeSizeAttributeScale = computed(() => {
      if (props.nodeSizeAttribute === nodeSizeAttributeType.NONE) return (d) => d;
      const attributeCounts = props.nodeSizeAttribute === nodeSizeAttributeType.CHANNELS
        ? nodes.map((node) => node.props.length + node.events.length + node.slots.length)
        : nodes.map((node) => node[props.nodeSizeAttribute].length);
      return d3.scaleLinear(d3.extent(attributeCounts), [8, 30]);
    });

    const calculateNodeSize = (d) => {
      if (props.nodeSizeAttribute === nodeSizeAttributeType.NONE) return NODE_SIZE_NO_FILTER;

      const value = props.nodeSizeAttribute === nodeSizeAttributeType.CHANNELS
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
          const channelCircleRadius = nodeSize.get(currentNodes[i]) + 3;
          return channelCircleRadius * Math.cos(getCirclePositionFactor(i, channelCircleRadius) - Math.PI * 0.5);
        })
        .attr('cy', (d, i, currentNodes) => {
          const channelCircleRadius = nodeSize.get(currentNodes[i]) + 3;
          return channelCircleRadius * Math.sin(getCirclePositionFactor(i, channelCircleRadius) - Math.PI * 0.5);
        });
    };

    const updateArrowTips = () => {
      const LINK_ARROW_SIZE = 4;
      d3.selectAll('.arrow')
        .transition(transitionTime)
        .attr('refX', (d) => {
          const targetNode = nodes.find((node) => node.id === d.target.id);
          return calculateNodeSize(targetNode) + LINK_ARROW_SIZE;
        });
    };

    const drawCommunicationChannelCircles = () => {
      d3.selectAll('.node--selectedDependent')
        .append('g')
        .selectAll('.node__channel')
        .data((data) => {
          const dependent = selectedComponent.value?.dependents.find((dep) => dep.fullPath === data.fullPath);
          return dependent ? dependent[`used${selectedChannelType.value}`] : [];
        })
        .join(
          (enter) => enter.append('circle')
            // eslint-disable-next-line func-names, prefer-arrow-callback
            .attr('r', SMALL_CIRCLE_RADIUS)
            .attr('class', `node__channel node__channel--${selectedChannelType.value.toLowerCase()}`)
            .on('mouseover', (d) => {
              showTooltip.value = true;
              tooltipContent.value = selectedComponent.value[selectedChannelType.value.toLowerCase()][d].name;
              tooltipPositionX.value = d3.event.pageX;
              tooltipPositionY.value = d3.event.pageY;
            })
            .on('mouseout', () => {
              showTooltip.value = false;
            })
            .on('click', (d) => {
              updateSelectedChannel(selectedComponent.value[selectedChannelType.value.toLowerCase()][d]);
              d3.event.stopPropagation();
            }),
        );
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
      updateSelectedComponent(null);
      d3.selectAll('.node--selected').classed('node--selected', false);
      d3.selectAll('.node--selectedDependent').classed('node--selectedDependent', false);
      d3.selectAll('.link--selected').classed('link--selected', false);
      d3.selectAll('.arrow--selected').classed('arrow--selected', false);
      d3.selectAll('.node--greyedOut').classed('node--greyedOut', false);
      d3.selectAll('.link--greyedOut').classed('link--greyedOut', false);
      removeNodeChannels();
      resetChannelSelection();
      d3.selectAll('.node').raise();
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
        .avoidOverlaps(true)
        .symmetricDiffLinkLengths(20)
        .start(10, 15, 20);

      const LINK_ARROW_SIZE = 4;
      svg.append('defs').selectAll('.arrow')
        .data(links)
        .enter()
        .append('marker')
        .attr('class', 'arrow')
        .attr('id', (d) => `arrow-${d.source.index}-${d.target.index}`)
        .attr('viewBox', `0 -${LINK_ARROW_SIZE / 2} ${LINK_ARROW_SIZE} ${LINK_ARROW_SIZE}`)
        .attr('refX', (d) => {
          const targetNode = nodes.find((node) => node.id === d.target.id);
          return calculateNodeSize(targetNode) + LINK_ARROW_SIZE;
        })
        .attr('refY', 0)
        .attr('markerWidth', LINK_ARROW_SIZE)
        .attr('markerHeight', LINK_ARROW_SIZE)
        .attr('orient', 'auto')
        .append('path')
        .attr('d', `M1,-${(LINK_ARROW_SIZE / 2) - 1}
          L${LINK_ARROW_SIZE - 1},0
          L1,${(LINK_ARROW_SIZE / 2) - 1}
          L1,-${(LINK_ARROW_SIZE / 2) - 1} Z`)
        .style('opacity', '1');

      const link = g.selectAll('line')
        .data(links)
        .enter()
        .append('line')
        .attr('id', (d) => `link-${d.source.index}-${d.target.index}`)
        .attr('class', 'link')
        .attr('marker-end', (d) => `url(#arrow-${d.source.index}-${d.target.index})`);

      const node = g.selectAll('g')
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

          selectedComponent.value = data;

          // highlight selected node + dependents
          const dependents = links.filter((l) => l.target.index === data.index);
          dependents.forEach((dependent) => {
            d3.select(`#link-${dependent.source.index}-${dependent.target.index}`)
              .classed('link--selected', true)
              .raise();
            d3.select(`#arrow-${dependent.source.index}-${dependent.target.index}`)
              .classed('arrow--selected', true)
              .raise();
            d3.select(`#node-${dependent.source.index}`).classed('node--selectedDependent', true);
          });
          d3.selectAll('.node--selectedDependent').raise();
          d3.select(this).classed('node--selected', true).raise();
          drawCommunicationChannelCircles();

          // grey out everything else
          d3.selectAll('.node:not(.node--selected, .node--selectedDependent)').classed('node--greyedOut', true);
          d3.selectAll('.link:not(.link--selected').classed('link--greyedOut', true);

          updateSelectedComponent(data);
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
        .classed(`node--uses${selectedChannelType.value}`, (d) => {
          const dependent = selectedComponent.value?.dependents.find((dep) => dep.fullPath === d.fullPath);
          const channels = selectedComponent.value[selectedChannelType.value.toLowerCase()];
          return dependent[`used${selectedChannelType.value}`].some((prop) => channels[prop].name === channel.name);
        });

      d3.selectAll(`.node--selectedDependent .node__channel--${selectedChannelType.value.toLowerCase()}`)
        .classed(
          'node__channel--selected',
          (d) => selectedComponent.value[selectedChannelType.value.toLowerCase()][d].name === channel.name,
        );
    };

    watch(() => props.nodeSizeAttribute, () => {
      updateNodeSize();
      updateCommunicationChannelPositions();
      updateArrowTips();
    });

    watch(() => props.searchString, () => {
      d3.selectAll('.node')
        .classed('node--searchMatches', (d) => props.searchString.length > 0
          && d.name.toLowerCase().includes(props.searchString.toLowerCase()));
    });

    watch(() => selectedChannel.value, () => {
      resetChannelSelection();
      if (selectedChannel.value) highlightChannelUsage(selectedChannel.value);
    });

    watch(() => selectedChannelType.value, () => {
      removeNodeChannels();
      resetChannelSelection();
      drawCommunicationChannelCircles();
    });

    return {
      selectedChannel,
      showTooltip,
      tooltipContent,
      tooltipPositionX,
      tooltipPositionY,
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

    &:hover &__circle {
      stroke: var(--grey-30);
    }

    &:hover &__labelText {
      fill: var(--navy-90);
    }

    &__label {
        cursor: pointer;
    }

    &__labelText {
        font-size: var(--font-size--3xs);
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

          &:hover {
            fill: var(--mint-50);
            stroke: var(--mint-70);
          }
        }

        &--events {
            fill: var(--red-grey);
            stroke: var(--red-50);

            &:hover {
              fill: var(--red-50);
              stroke: var(--red-70);
            }
        }

        &--slots {
            fill: var(--purple-grey);
            stroke: var(--purple-50);

            &:hover {
              fill: var(--purple-50);
              stroke: var(--purple-70);
            }
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

    &--searchMatches {
        .node__labelBackground {
            fill: var(--yellow-30) !important;
        }

        .node__labelText {
          fill: var(--navy-90) !important;
        }
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
        .node__circle {
            stroke: none;
            fill: var(--grey-5);
        }

        .node__labelBackground {
            fill: var(--grey-5);
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

.arrow {
    stroke: var(--grey-20);
    fill: var(--grey-20);

    &--selected {
        stroke: var(--grey-50);
        fill: var(--grey-50);
    }
}
</style>
