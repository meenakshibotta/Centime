
import { useSelector } from "react-redux";
import { Sankey } from './sankey';
import { State } from "./store/state";

export const InflowOutFlowContainter = ({ width = 700, height = 400 }) => {
    const inflow = useSelector((state: State) => state.inflowOutFlowData);
    if (width === 0 || !inflow) {
        return null;
    }
    return <Sankey data={inflow} width={width} height={height} />;
};
