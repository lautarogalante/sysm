#!/usr/bin/bash
#
go build sys_monitor.go
cp sys_monitor sys_monitor-x86_64-unknown-linux-gnu
rm ~/dev/system-monitor/system-monitor-gui/bin/sys_monitor-x86_64-unknown-linux-gnu
mv sys_monitor-x86_64-unknown-linux-gnu ~/dev/system-monitor/system-monitor-gui/bin/
echo "Listo.."
#cd ~/dev/system-monitor/system-monitor-gui
#npm run tauri dev

