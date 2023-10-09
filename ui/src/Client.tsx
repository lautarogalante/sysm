import { useEffect, useState } from "react";
import Cores from "./CpuInfo";
import Memory from "./MemoryInfo";
import SystemStats from "./SystemStats";
import Process from "./Process";
import Disk from "./DiskStats";
import { ProcessInfo } from "./Process";
import SearchBar from "./SearchBar";
import "./styles/App.css";

function Client() {
  interface GenericData<T> {
    [key: string]: T;
  }

  const [data, setData] = useState<GenericData<any>>([]);
  const [searchValue, setSearchValue] = useState("");
  
  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8000/Get");
    let obj: any = null;

    socket.addEventListener("message", function (event) {
      const dataStr = event.data;
      obj = JSON.parse(dataStr);
    });

    const interval = setInterval(() => {
      if (obj) {
        setData(obj);
        obj = null;
      }
    }, 1300);

    return () => clearInterval(interval);

  }, []);

  return (
    <div className="main-cont-2">
      <div className="progress-bar-cont">
        <Cores data={data} />
        <div className="memory-and-disk-cont">
          <Memory data={data} />
          <Disk data={data} />
        </div>
      </div>
      <div className="search-bar-cont">
        <SearchBar onSearch={setSearchValue} />
      </div>
      <div className="process-cont">
        {data.Processes && (
          <Process
            data={data as { Processes: ProcessInfo[] }}
            searchValue={searchValue}
          />
        )}
      </div>
      <div className="system-cont">
        <SystemStats data={data} />
      </div>
    </div>
  );
}

export default Client;
