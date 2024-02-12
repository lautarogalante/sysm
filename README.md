## Sysm is a system monitor that lists the processes and show their resource usage.

The user interface is implemented in Tauri, React, and the backend is written in Go.

## Prerequisites for building and running the app.

**1. System Dependencies**

   You will need to install a couple of system dependencies.
   Below are commands for a few popular linux distributions:

**Debian**
```bash
sudo apt update
sudo apt install libwebkit2gtk-4.0-dev \
    build-essential \
    curl \
    wget \
    file \
    libssl-dev \
    libgtk-3-dev \
    libayatana-appindicator3-dev \
    librsvg2-dev
```

**Arch**
```bash
sudo pacman -Syu
sudo pacman -S --needed \
    webkit2gtk \
    base-devel \
    curl \
    wget \
    file \
    openssl \
    appmenu-gtk-module \
    gtk3 \
    libappindicator-gtk3 \
    librsvg \
    libvips
```

**2. Rust**

 To install Rust on Linux, open a terminal and enter the following command:

```bash
curl --proto '=https' --tlsv1.2 https://sh.rustup.rs -sSf | sh
```

**3. Build the Go binary**
```bash
chmod +x install.sh
```
  Run:

>`./install.sh`


**4. Install UI dependencies**

```bash
cd ui
npm install
```

**5. Build and run the app in development mode** 

>``npm run tauri dev``

