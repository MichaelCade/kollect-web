# Kollect Web

This repository hosts the public website and release distribution for [Kollect](https://github.com/MichaelCade/kollect), a multi-cloud and infrastructure discovery tool. Binaries are synced here automatically from the (private) main repository so they can be downloaded without access to the source.

## 🌐 Website

Live at: [https://kollect.upthestack.io](https://kollect.upthestack.io)

## 📦 Downloads

Binaries are published on the [releases page](https://github.com/MichaelCade/kollect-web/releases). Each release includes:

| OS | amd64 | arm64 | 386 |
|----|-------|-------|-----|
| Linux | `kollect-linux-amd64` | `kollect-linux-arm64` | `kollect-linux-386` |
| macOS | `kollect-darwin-amd64` | `kollect-darwin-arm64` | — |
| Windows | `kollect-windows-amd64.exe` | `kollect-windows-arm64.exe` | `kollect-windows-386.exe` |

## 🚀 Quick Start

### Linux
```bash
curl -L -o kollect https://github.com/MichaelCade/kollect-web/releases/latest/download/kollect-linux-amd64
chmod +x kollect
./kollect --browser
```

### macOS (Apple Silicon; use `kollect-darwin-amd64` for Intel)
```bash
curl -L -o kollect https://github.com/MichaelCade/kollect-web/releases/latest/download/kollect-darwin-arm64
chmod +x kollect
./kollect --browser
```

### Windows (PowerShell)
```powershell
Invoke-WebRequest -Uri "https://github.com/MichaelCade/kollect-web/releases/latest/download/kollect-windows-amd64.exe" -OutFile "kollect.exe"
.\kollect.exe --browser
```

## 📖 Documentation

- [Getting Started](docs/getting-started.html)
- [Configuration](docs/configuration.html)
- [API Reference](docs/api.html)
- [Troubleshooting](docs/troubleshooting.html)
- [Download Stats](stats.html)

## 🔧 What Kollect discovers

Grouped the way the app presents them:

- **Cloud** — AWS, Azure, GCP (Oracle Cloud coming soon)
- **Cloud-Native** — Kubernetes, Red Hat OpenShift, Docker
- **DevOps** — Terraform, HashiCorp Vault (GitHub, Azure DevOps, Jira, Confluence coming soon)
- **Virtualization** — VMware vSphere, Microsoft Hyper-V, Proxmox VE, Nutanix AHV (HPE, XCP-ng, OpenStack coming soon)

Plus cross-cutting capabilities: **Snapshot Hunter**, **Cost Explorer**, **Platform Mapper**, a native **MCP server** for AI tools, and **Veeam Scenario Builder** CSV export.

## 🏗️ Repository structure

```
kollect-web/
├── index.html              # Landing page
├── stats.html              # Live download-stats page
├── assets/                 # CSS, JS, images
│   ├── style.css           # Styles + light/dark theme tokens
│   ├── script.js           # Landing-page release/download logic
│   ├── stats.js            # Stats page (live GitHub API fetch)
│   └── theme.js            # Shared light/dark theme toggle
├── docs/                   # Documentation pages
├── releases/               # Release metadata (auto-synced)
└── _config.yml             # GitHub Pages configuration
```

## 🎨 Theme

The site follows the visitor's OS light/dark preference on first visit; a header toggle overrides it and the choice is remembered.

## 🤖 Automated updates

Releases and binaries are synced here automatically when a new version is published in the main Kollect repository via GitHub Actions.

## 🔗 Links

- [Main Repository](https://github.com/MichaelCade/kollect)
- [Issues & Support](https://github.com/MichaelCade/kollect/issues)
- [Discussions](https://github.com/MichaelCade/kollect/discussions)
