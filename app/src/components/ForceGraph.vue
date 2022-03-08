<template>
  <svg ref="graphRef" class="forceGraph"></svg>
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
  setup(props, { emit }) {
    const graphRef = ref(null);
    const width = 800;
    const height = 400;

    const unselect = () => {
      d3.selectAll('.node--selected').classed('node--selected', false);
      d3.selectAll('.node--selected-dependent').classed('node--selected-dependent', false);
      d3.selectAll('.link--selected').classed('link--selected', false);
      d3.selectAll('.node--greyed-out').classed('node--greyed-out', false);
      d3.selectAll('.link--greyed-out').classed('link--greyed-out', false);
    };

    onMounted(() => {
      const nodes = props.data.nodes.map((d) => Object.create(d));
      const index = new Map(nodes.map((d) => [d.id, d]));
      const links = props.data.links.map((d) => Object.assign(Object.create(d), {
        source: index.get(d.source),
        target: index.get(d.target),
      }));

      const svg = d3.select(graphRef.value)
        .attr('viewBox', [0, 0, width, height])
        .attr('class', 'svg')
        .on('click', () => {
          unselect();
        });

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

          unselect();

          // highlight selected node + dependents
          d3.select(this).classed('node--selected', true);
          const dependents = links.filter((l) => l.target.index === data.index);
          dependents.forEach((dependent) => {
            d3.select(`#node-${dependent.source.index}`).classed('node--selected-dependent', true);
            d3.select(`#link-${dependent.source.index}-${dependent.target.index}`).classed('link--selected', true);
          });

          // grey out everything else
          d3.selectAll('.node:not(.node--selected, .node--selected-dependent)').classed('node--greyed-out', true);
          d3.selectAll('.link:not(.link--selected').classed('link--greyed-out', true);

          emit('selected', data.id);
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
        fill: var(--mint-50);
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
