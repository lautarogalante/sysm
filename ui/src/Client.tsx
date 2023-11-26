import { useEffect, useState } from "react";
import Cores from "./CpuComp/CpuInfo";
import Memory from "./MemoryComp/MemoryInfo";
import SystemStats from "./SystemComp/SystemStats";
import Process from "./ProcessComp/Process";
import Disk from "./DiskComp/DiskStats";
import { ProcessInfo } from "./ProcessComp/Process";
import SearchBar from "./SearchComp/SearchBar";
import "./styles/App.css";
import Button from "./ButtonComp/Button";
import Delete from "./icons/Delete";

function Client() {
  interface GenericData<T> {
    [key: string]: T;
  }

  const [data, setData] = useState<GenericData<any>>([]);
  const [searchValue, setSearchValue] = useState("");
  const [display, setDisplayDelete] = useState("block");


  const toggleDisplay = () => {
    setDisplayDelete(display === 'block' ? 'none' : 'block');
  }
 
 
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
        <SearchBar onSearch={setSearchValue}/>
        <Button classCss="button-cont-delete" Color="#e4e4e7" IconComponent={Delete} display={display}/>
      </div>
      <div className="process-cont">
        {data.Processes && (
          <Process
            data={data as { Processes: ProcessInfo[] }}
            searchValue={searchValue}
            Click={toggleDisplay}
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
