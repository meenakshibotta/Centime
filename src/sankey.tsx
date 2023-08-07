import { scaleOrdinal, select } from "d3";
import { SankeyGraph, sankey, sankeyJustify, sankeyLinkHorizontal } from "d3-sankey";
import { Inflow_outflow } from "./type";

const MARGIN_Y = 25;
const MARGIN_X = 5;
const COLORS = ["#e0ac2b", "#e85252", "#6689c6", "#9a6fb0", "#a53253"];

type SankeyProps = {
  width: number;
  height: number;
  data: Inflow_outflow;
};

export const Sankey = ({ width, height, data }: SankeyProps) => {
  const allGroups = [...new Set(data.nodes.map((d) => d.category))].sort();
  const colorScale = scaleOrdinal<string>().domain(allGroups).range(COLORS);

  // Set the sankey diagram properties
  const sankeyGenerator = sankey() // TODO: find how to type the sankey() function
    .nodeWidth(26)
    .nodePadding(10)
    .extent([
      [MARGIN_X, MARGIN_Y],
      [width - MARGIN_X, height - MARGIN_Y],
    ])
    .nodeId((node: any) => node.name) // Accessor function: how to retrieve the id that defines each node. This id is then used for the source and target props of links
    .nodeAlign(sankeyJustify); // Algorithm used to decide node position

  // Compute nodes and links positions
  const obj = JSON.parse(JSON.stringify(data));
  const { nodes, links } = sankeyGenerator(obj as SankeyGraph<{}, {}>);

  //
  // Draw the nodes
  //
  const allNodes = nodes.map((node: any) => {
    return (
      <g key={node.index}>
        <rect
          height={node.y1 - node.y0}
          width={sankeyGenerator.nodeWidth()}
          x={node.x0}
          y={node.y0}
          stroke={"black"}
          fill={colorScale(node.category)}
          fillOpacity={1}
          rx={0.9}
          onMouseOver={(d) => {
            const tooltip = select(".tooltip");
            tooltip.style("display", "inline");
            tooltip.html(`Node: ${d}<br/>Value: ${d.target}`);
          }}
        />
      </g>
    );
  });
  //
  // Draw the links
  //
  const allLinks = links.map((link: any, i: any) => {
    const linkGenerator = sankeyLinkHorizontal();
    const path = linkGenerator(link);

    return (
      <path
        key={i}
        d={path!}
        stroke={colorScale(link.source.category)}
        fill="none"
        strokeOpacity={0.3}
        strokeWidth={link.width}
      />
    );
  });

  //
  // Draw the Labels
  //
  const allLabels = nodes.map((node: any, i: any) => {
    return (
      <text
        key={i}
        x={node.x0 < width / 2 ? node.x1 + 6 : node.x0 - 6}
        y={(node.y1 + node.y0) / 2}
        dy="0.35rem"
        textAnchor={node.x0 < width / 2 ? "start" : "end"}
        fontSize={12}
      >
        {node.name}
      </text>
    );
  });

  return (
    <div>
      <svg width={width} height={height}>
        {allLinks}
        {allNodes}
        {allLabels}
      </svg>
    </div>
  );
};
