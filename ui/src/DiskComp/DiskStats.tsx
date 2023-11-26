import React from "react";
import { convertToGb, getColor } from "../BarComp/ProgressBarMemory";
import '../styles/ProgressBar.css';

interface DiskProps {
  data: any;
}

const Disk: React.FC<DiskProps> = ({ data }) => {
  if (data.DiskInfo) {
    const { DiskInfo } = data;
    const sections = 42;
    const sectionPercent = 100 / sections;
    const stack: any[] = [];
    const diskPercent = DiskInfo.Percent;
    const diskUsed = convertToGb(DiskInfo.Used);
    const diskTotal = convertToGb(DiskInfo.Total);
    
    for (let i = 0; i < Math.round(diskPercent / sectionPercent); i++) {
      stack.push(getColor(diskPercent - i * sectionPercent));
    }

    return (
      <div className="progress-bar-container-disk">
        <div className="disk">
          <div className="disk-name">Disk</div>
          <div className="progress-bar-disk">
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
          <div className="disk-percent"><span>{diskUsed} / {diskTotal}</span></div>
        </div>
      </div>
    );
  }
};

export default Disk;
