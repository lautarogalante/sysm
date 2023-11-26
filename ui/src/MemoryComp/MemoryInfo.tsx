import ProgressBarMemory from "../BarComp/ProgressBarMemory";

interface MemoryProps {
    data: any
}

const Memory: React.FC<MemoryProps> = ({ data }) => {


    if (data.MemoryInfo) {

        const { MemoryInfo } = data;

        return (
            <div className="memory-container">
                <ProgressBarMemory memoryValues={MemoryInfo} />
            </div>
        );
    }

    return null;
};
export default Memory;
