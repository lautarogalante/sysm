import { useMemo } from "react";
import "./styles/ProgressBar.css";

interface ProgressBarMemoryProps {
  memoryValues: any;
}

const ProgressBarMemory: React.FC<ProgressBarMemoryProps> = ({
  memoryValues,
}) => {
  const sections = 42;
  const sectionPercent = 100 / sections;
  const stack: any[] = [];
  const memoryPercent = memoryValues.Percent;
  const memoryTotalInBytes = memoryValues.Total;
  const memoryUsedInBytes = memoryValues.Used;
  const memoryTotal = useMemo(() => convertToGb(memoryTotalInBytes), [memoryTotalInBytes]);
  const memoryUsed = useMemo(() => convertToGb(memoryUsedInBytes), [memoryUsedInBytes]);

  for (let j = 0; j < Math.round(memoryPercent / sectionPercent); j++) {
    stack.push(getColor(memoryPercent - j * sectionPercent));
  }

  return (
    <div className="progress-bar-container-memory">
      <div className="memory">
        <div className="memory-name">Mem</div>
        <div className="progress-bar-memory">
          {[...Array(sections)].map((_, j) => (
            <div
              key={j}
              className="progress-bar-section"
              style={{
                backgroundColor: stack.pop() || "transparent",
              }}
            ></div>
          ))}
        </div>
        <div className="memory-percent">
          {memoryUsed} / {memoryTotal}
        </div>
      </div>
    </div>
  );
};

export function convertToGb(values: number): string {
  const valuesInGb = values / 2 ** 30;
  if(valuesInGb < 1){
    const valuesInMb = values / 2 ** 20;
    return `${Math.round(valuesInMb * 100) / 100} MB`;
  }else {
    return `${Math.round(valuesInGb * 100) / 100} GB`;
  }

}

export function getColor(memoryPercent: number): string {
  if (memoryPercent >= 75) {
    return "#B70404";
  } else if (memoryPercent >= 50 && memoryPercent < 75) {
    return "#FF6000";
  } else if (memoryPercent >= 25 && memoryPercent < 50) {
    return "#FFD93D";
  } else if (memoryPercent >= 0 && memoryPercent < 25) {
    return "lightgreen";
  } else {
    return "transparent";
  }
}

export default ProgressBarMemory;
