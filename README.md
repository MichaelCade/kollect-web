# Kollect Web

This repository hosts the public website and release distribution for [Kollect](https://github.com/MichaelCade/kollect), a multi-cloud infrastructure discovery tool.

## 🌐 Website

Visit the live website at: [https://michaelcade.github.io/kollect-web](https://michaelcade.github.io/kollect-web)

## 📦 Downloads

Get the latest releases for your platform:

- **Linux**: `kollect-linux`
- **Windows**: `kollect-windows.exe`
- **macOS**: `kollect-darwin`

## 🚀 Quick Start

### Linux/macOS
```bash
# Download the binary
curl -L -o kollect https://github.com/MichaelCade/kollect/releases/latest/download/kollect-linux
chmod +x kollect

# Run discovery
./kollect
```

### Windows
```powershell
# Download kollect-windows.exe and run
kollect-windows.exe
```

## 📖 Documentation

- [Getting Started](docs/getting-started.html)
- [Configuration](docs/configuration.html)
- [API Reference](docs/api.html)
- [Troubleshooting](docs/troubleshooting.html)

## 🔧 Features

Kollect automatically discovers and inventories resources across:

- **AWS**: EC2, S3, RDS, DynamoDB, VPCs, EFS
- **Azure**: VMs, Storage Accounts, Blob Containers, Virtual Networks
- **Google Cloud**: Compute Instances, Cloud Storage, Cloud SQL
- **VMware vSphere**: VMs, Datastores, Clusters
- **Docker**: Containers, Images, Volumes, Networks
- **Kubernetes**: Clusters, Pods, Services, Deployments

## 🏗️ Repository Structure

```
kollect-web/
├── index.html              # Main landing page
├── assets/                 # CSS, JS, images
│   ├── style.css
│   └── script.js
├── docs/                   # Documentation pages
├── releases/               # Release binaries (auto-updated)
└── _config.yml            # GitHub Pages configuration
```

## 🤖 Automated Updates

This repository is automatically updated when new releases are published in the main Kollect repository through GitHub Actions.

## 📄 License

This project is open source. See the main [Kollect repository](https://github.com/MichaelCade/kollect) for license information.

## 🔗 Links

- [Main Repository](https://github.com/MichaelCade/kollect)
- [Issues & Support](https://github.com/MichaelCade/kollect/issues)
- [Discussions](https://github.com/MichaelCade/kollect/discussions)