# List Items System Update options in Modern SPO Stack

The demo shows capabilities for SharePoint list items `System Update` using client-side APIs.

## Prerequisites

- Node.js & PowerShell
- SharePoint Online

## Restore dependencies

```bash
npm install
```

Installs Node.js dependencies and PnP PowerShell (if not installed).

## Connect to SharePoint

```bash
npm run config -- --force
```

Prompts for SharePoint site url and credentials.

SharePoint online and SAML user credentials should be provided.

Use only test site collection.

## Provision demo artifacts

```bash
npm run provisioning
```

Provisions all the artifacts required for the demo.

## Demos

### JSOM

```bash
npm run demo:1
```

### JSOM (raw XML package)

```bash
npm run demo:2
```

### REST

```bash
npm run demo:3
```

## Reset test data

```bash
npm run reset
```

Recreates all existing items in a test list using random users from the site and ramdom dates.
