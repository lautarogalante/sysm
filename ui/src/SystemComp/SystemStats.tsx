import { convertToGb } from '../BarComp/ProgressBarMemory';
import '../styles/SystemStats.css'

interface Values {
    data: any;
};

const SystemStats: React.FC<Values> = ({ data }) => {

    if (data.CpuInfo && data.MemoryInfo) {
        const { Percent, Available } = data.MemoryInfo;
        const { Total } = data.CpuInfo;
        const memAvailableConverToGb = convertToGb(Available);

        return (
            <div className="system-cont-div">
                <div className="total-percent-cpu">Total CPU Percent: {Total} %</div>
                <div className="percent-memory"> Memory Percent: {Percent} %</div>
                <div className="available-memory">Memory Available: {memAvailableConverToGb}</div>
            </div>
        );
    }
};

export default SystemStats;
