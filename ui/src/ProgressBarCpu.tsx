import React from "react"
import "./styles/ProgressBar.css"

interface ProgressBarCpuProps {
    percents: number[]
}

const ProgressBarCpu: React.FC<ProgressBarCpuProps> = ({ percents }) => {

    const sections = 42;
    const sectionPercent = 100 / sections;
    const stack: any[] = [];

    return (
        <div className="progress-bar-container">
            {
                percents.map((percent, i) => {
                    for (let j = 0; j < Math.round(percent / sectionPercent); j++) {
                        stack.push(getColor(percent - j * sectionPercent));
                    }
                    return (

                        <div key={i} className="core">
                            <div className="core-index">{i}</div>
                            <div className="progress-bar">
                                {
                                    [...Array(sections)].map((_, j) => (
                                        <div
                                            key={j}
                                            className="progress-bar-section"
                                            style={{
                                                backgroundColor: stack.pop() || "transparent",
                                            }}
                                        ></div>
                                    ))
                                }
                            </div>
                            <div className="core-percent">{percent} %</div>
                        </div>

                    );
                })
            }
        </div>
    );

};

export const getColor = (percent: number) => {
    if (percent >= 64 && percent <= 100) {
        return "#B70404";
    } else if (percent >= 48 && percent < 64) {
        return "#FF6000";
    } else if (percent >= 24 && percent < 48) {
        return "#FFD93D";
    } else if (percent >= 0 && percent < 24) {
        return "lightgreen";
    }
    else {
        return "transparent";
    }
};

export default ProgressBarCpu;
