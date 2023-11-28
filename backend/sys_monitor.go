package main

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"math"
	"net/http"
	"os"
	"os/signal"
	"runtime"
	"strconv"
	"sync"
	"time"

	"github.com/shirou/gopsutil/v3/cpu"
	"github.com/shirou/gopsutil/v3/disk"
	"github.com/shirou/gopsutil/v3/mem"
	"github.com/shirou/gopsutil/v3/process"
	"nhooyr.io/websocket"
)

const OS_VERSION = runtime.GOOS

var (
	time_frequency time.Duration = time.Millisecond * 200
	mu             sync.RWMutex
)

/*struct definition*/
type SystemStats struct {
	CpuInfo    CpuInfo
	MemoryInfo MemoryInfo
	DiskInfo   DiskInfo
	Processes  []ProcessInfo
}

type CpuInfo struct {
	PercentPerCore []float64 `json:"Percent"`
	TotalPercent   float64   `json:"Total"`
}

type MemoryInfo struct {
	PercentMemory   float64 `json:"Percent"`
	UsedMemory      uint64  `json:"Used"`
	AvailableMemory uint64  `json:"Available"`
	TotalMemory     uint64  `json:"Total"`
}

type DiskInfo struct {
	Used           uint64  `json:"Used"`
	UsedPercent    float64 `json:"Percent"`
	AvailableSpace uint64  `json:"Available"`
	TotalDisk      uint64  `json:"Total"`
}

type ProcessInfo struct {
	Pid           int32   `json:"Pid"`
	User          string  `json:"User"`
	Name          string  `json:"ProcessName"`
	PercentCpu    float64 `json:"PercentCpu"`
	PercentMemory float32 `json:"PercentMemory"`
}

/*Method to obtain the cpu status*/
func getCpuInfoLinux() (*CpuInfo, error) {

	var percentTotal float64
	percentCpu, error := cpu.Percent(getTimeFrequency(), true)

	if error != nil {
		return nil, fmt.Errorf("Error when obtaining the cpu status")
	}

	for i := 0; i < len(percentCpu); i++ {
		percentTotal += percentCpu[i]
	}

	percentTotal /= float64(len(percentCpu))

	ret := &CpuInfo{
		PercentPerCore: percentCpu,
		TotalPercent:   percentTotal,
	}

	return ret, error
}

/*Method to obtain the memory status and save de values in MemoryInfo (struct)*/
func getMemoryInfoLinux() (*MemoryInfo, error) {
	memoryStat, error := mem.VirtualMemory()

	if error != nil {
		return nil, fmt.Errorf("Error when obtaining the memory status")
	}

	ret := &MemoryInfo{
		PercentMemory:   memoryStat.UsedPercent,
		UsedMemory:      memoryStat.Used,
		AvailableMemory: memoryStat.Available,
		TotalMemory:     memoryStat.Total,
	}

	return ret, nil
}

/*Method to obtain the disk values*/
func getDiskInfo() (*DiskInfo, error) {
	disk, diskError := disk.Usage("/")

	if diskError != nil {
		return nil, fmt.Errorf("Error when obtaining the disk values")
	}

	ret := &DiskInfo{
		Used:           disk.Used,
		UsedPercent:    disk.UsedPercent,
		TotalDisk:      disk.Total,
		AvailableSpace: disk.Total - disk.Used,
	}

	return ret, nil
}

/*Method to obtain the process data and save the values in ProccessInfo (struct)*/
func getProcessesStatsLinux() ([]ProcessInfo, error) {

	var processInfo []ProcessInfo
	processes, error := process.Processes()

	if error != nil {
		return nil, fmt.Errorf("Error when obtaining the processes")
	}

	for _, p := range processes {
		userName, errUser := p.Username()
		processName, errProcessName := p.Name()
		percentCpu, errPercentCpu := p.CPUPercent()
		percentMemory, errPercentMemory := p.MemoryPercent()

		if errUser != nil {

			return nil, fmt.Errorf("Error when obtaining the username of the process")
		} else if errProcessName != nil {

			return nil, fmt.Errorf("Error when obtaining the process name")
		} else if errPercentCpu != nil {

			return nil, fmt.Errorf("Error when obtaining the cpu percent of the process")
		} else if errPercentMemory != nil {

			return nil, fmt.Errorf("Error when obtaining the memory percent of the process")
		}

		if (percentCpu > 0 && percentMemory > 0) && userName != "root" {
			ret := ProcessInfo{
				Pid:           p.Pid,
				User:          userName,
				Name:          processName,
				PercentCpu:    percentCpu,
				PercentMemory: percentMemory,
			}
			processInfo = append(processInfo, ret)
		}
	}

	return processInfo, nil
}

func setTimeFrequency(d time.Duration) {
	mu.Lock()
	defer mu.Unlock()
	time_frequency = d
}

func getTimeFrequency() time.Duration {
	mu.RLock()
	defer mu.RUnlock()
	return time_frequency
}

/*Method to round the values to .2f using the memory reference*/
func roundValues(s *SystemStats) {

	for i := range s.CpuInfo.PercentPerCore {
		s.CpuInfo.PercentPerCore[i] = math.Round(s.CpuInfo.PercentPerCore[i]*100) / 100
	}

	s.CpuInfo.TotalPercent = math.Round(s.CpuInfo.TotalPercent*100) / 100
	s.MemoryInfo.PercentMemory = math.Round(s.MemoryInfo.PercentMemory*100) / 100
	s.DiskInfo.UsedPercent = math.Round(s.DiskInfo.UsedPercent*100) / 100

	for i := range s.Processes {
		s.Processes[i].PercentCpu = math.Round(s.Processes[i].PercentCpu*100) / 100
		s.Processes[i].PercentMemory = float32(math.Round(float64(s.Processes[i].PercentMemory*100))) / 100
	}
}

/*Method to group all data in the main struct (SystemStats)*/
func buildTotalData() (*SystemStats, error) {

	cpuInfo, errCpu := getCpuInfoLinux()
	memoryInfo, errMemory := getMemoryInfoLinux()
	diskInfo, errDisk := getDiskInfo()
	processInfo, errProcess := getProcessesStatsLinux()

	if errCpu != nil {

		return nil, fmt.Errorf("%s", errCpu.Error())
	} else if errMemory != nil {

		return nil, fmt.Errorf("%s", errMemory.Error())
	} else if errDisk != nil {

		return nil, fmt.Errorf("%s", errDisk.Error())
	} else if errProcess != nil {

		return nil, fmt.Errorf("%s", errProcess.Error())
	}

	ret := &SystemStats{
		CpuInfo:    *cpuInfo,
		MemoryInfo: *memoryInfo,
		DiskInfo:   *diskInfo,
		Processes:  processInfo,
	}

	roundValues(ret)

	return ret, nil
}

/*Method to handle conetions to the frontend*/
func handleConnection(ctx context.Context, cancel context.CancelFunc, w http.ResponseWriter, r *http.Request) error {

	opt := &websocket.AcceptOptions{
		OriginPatterns: []string{"*"},
	}

	c, err := websocket.Accept(w, r, opt)

	if err != nil {
		return err
	}

	defer c.Close(websocket.StatusInternalError, "the sky is falling")

	/*Create a channel to recive data from the frontend and send data*/
	messages := make(chan string)
	dataChan := make(chan *SystemStats)
	errChan := make(chan error)

	defer cancel()

	go scanMessages(ctx, c, messages, errChan)
	go sendDataToChannel(ctx, dataChan, errChan)

	var changeTimeFrequency bool = false

	for {

		select {
		case <-ctx.Done():
			return ctx.Err()

		case err := <-errChan:
			log.Printf("Error: %v", err)
		case data := <-messages:
			killPID(data)
		default:
			err := sendDataToClient(ctx, c, dataChan)

			if err != nil {
				cancel()
				return err
			}

			time.Sleep(getTimeFrequency())
		}

		if !changeTimeFrequency {
			setTimeFrequency(time.Millisecond * 1300)
			changeTimeFrequency = true
		}
	}
}

func killPID(data string) {
	if data != "" {
		PID, err := strconv.ParseInt(data, 10, 64)
		if err != nil {
			fmt.Printf("Error: %v", err)
		} else {
			process, err := os.FindProcess(int(PID))
			if err != nil {
				log.Printf("Error to find process: %v", err)
			}
			err = process.Kill()
			if err != nil {
				log.Printf("Error to killing the process: %v", err)
			}
		}
	}
}

/*Method to scan messages in the conection*/
func scanMessages(ctx context.Context, c *websocket.Conn, messages chan string, errChan chan error) error {

	for {
		select {

		case <-ctx.Done():
			return ctx.Err()
		default:

			_, data, err := c.Read(ctx)

			if websocket.CloseStatus(err) == websocket.StatusNormalClosure || err == io.EOF {
				errChan <- err
				return nil
			}
			messages <- string(data)
		}
	}
}

/*Method to send the data to de channel*/
func sendDataToChannel(ctx context.Context, dataChan chan *SystemStats, errChan chan error) {
	for {
		select {

		case <-ctx.Done():
			return
		default:
			data, err := buildTotalData()

			if err != nil {
				errChan <- err
				continue
			}

			dataChan <- data
			time.Sleep(getTimeFrequency())
		}
	}
}

/*Method to send data to client*/
func sendDataToClient(ctx context.Context, c *websocket.Conn, dataChan chan *SystemStats) error {

	select {
	case <-ctx.Done():
		return ctx.Err()
	case data := <-dataChan:

		jsonData, err := json.Marshal(data)

		if err != nil {
			log.Println(fmt.Errorf("Error when serializing the data json"))
			return err
		}

		err = c.Write(ctx, websocket.MessageText, jsonData)

		if err != nil {
			return err
		}
	}
	return nil
}

func startServer(ctx context.Context, cancel context.CancelFunc, stopChan <-chan os.Signal) error {

	server := &http.Server{
		Addr: "localhost:8000",
	}

	errChan := make(chan error)

	go func() {
		http.HandleFunc("/Get", func(w http.ResponseWriter, r *http.Request) {
			if err := handleConnection(ctx, cancel, w, r); err != nil {
				errChan <- err
			}
		})

		if err := server.ListenAndServe(); err != http.ErrServerClosed {
			errChan <- err
		}

	}()

	select {
	case <-stopChan:
		log.Println("Receive stop signal")
	case err := <-errChan:
		log.Printf("Connection Closed: %v", err)
	}

	defer cancel()

	if err := server.Shutdown(ctx); err != nil {
		log.Printf("Shutdown error: %v\n", err)

	} else {
		log.Print("Server stopped gracefully.")
		return nil
	}
	return nil
}

func main() {
	stopChan := make(chan os.Signal, 1)
	signal.Notify(stopChan, os.Interrupt)

	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	err := startServer(ctx, cancel, stopChan)

	if err != nil {
		fmt.Printf("Ocurrio un Error: %v\n", err)
	}

}
