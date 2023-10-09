import React, { useState, useEffect }from "react";
import "./styles/Table.css";

export interface ProcessInfo {
  Pid: number;
  User: string;
  PercentCpu: number;
  PercentMemory: number;
  ProcessName: string;
}

interface ProcessProps {
  data: {
    Processes: ProcessInfo[];
  };
  searchValue?: string;
}

const Process: React.FC<ProcessProps> = ({ data, searchValue = "", }) => {
  const { Processes } = data;
  const [tableHeigth, setTableHeight] = useState('auto');
  const [filteredProcesses, setFilteredProcesses] = useState<ProcessInfo[]>([]);

useEffect(() => {
  if (Processes) {
    const newFilteredProcesses = searchValue === "" ? Processes : Processes.filter(
      (process) =>
        process.Pid.toString() === searchValue ||
        process.ProcessName.toLowerCase().startsWith(searchValue.toLowerCase())
    );
    setFilteredProcesses(newFilteredProcesses);
    setTableHeight(`${newFilteredProcesses.length * 2}rem`);
  }

},[Processes, searchValue]);

  if(filteredProcesses.length > 0) {
    return (
      <table className="table-width" id="tr-width" style={{height: tableHeigth}}>
        <thead className="sticky-header bg-head">
          <tr>
            <th>Pid</th>
            <th>User</th>
            <th>CPU %</th>
            <th>Memory %</th>
            <th>Process name</th>
          </tr>
        </thead>
        <tbody>
          {filteredProcesses.map((process, index) => (
            <tr
              key={process.Pid}
              className={`${
                index % 2 === 0 ? "even-row" : "odd-row"
              } ${process.Pid.toString() === searchValue || process.ProcessName === searchValue ? "selected-row" : ""}`}
            >
              <td className="center-text">{process.Pid}</td>
              <td className="center-text">{process.User}</td>
              <td className="center-text">{process.PercentCpu}</td>
              <td className="center-text">{process.PercentMemory}</td>
              <td className="center-text">{process.ProcessName}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }
};

export default Process;
