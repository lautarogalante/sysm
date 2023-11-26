import ProgressBarCpu from "../BarComp/ProgressBarCpu";

interface CoresProps {
    data: any;
}

const Cores: React.FC<CoresProps> = ({ data }) => {

    const { CpuInfo } = data;

    if (CpuInfo) {
        return (
            <div className="cores-container">
                <ProgressBarCpu percents={CpuInfo.Percent}/>
            </div>
        );

    } else {
        return <p>No se obtubieron datos del CPU</p>
    }
};
export default Cores;
