#!/usr/bin/bash
#
go build
mv sysm system_monitor-x86_64-unknown-linux-gnu
rm ~/dev/sysm/ui/bin/*
mv system_monitor-x86_64-unknown-linux-gnu ~/dev/sysm/ui/bin/
echo "Listo.."

