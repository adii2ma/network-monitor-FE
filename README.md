# Network Monitor Frontend

A modern React/Next.js web application for visualizing and managing network infrastructure with interactive flow diagrams.

## 🎯 Overview

Interactive network monitoring dashboard that provides real-time visualization of network devices organized by areas/VLANs. Built with React Flow for dynamic network topology display and Tailwind CSS for modern styling.

## ✨ Features

### 🗺️ **Interactive Network Visualization**
- **React Flow Integration**: Drag-and-drop network topology
- **Real-time Updates**: Device status updates every 30 seconds
- **Color-coded Status**: Green (online) / Red (offline) device indicators
- **Hover Tooltips**: Quick device information on mouse hover

### 🏢 **Area-based Organization**
- **11 Network Areas**: PGCIL, Sophos, Plant Area, IT Dept, etc.
- **Smart Node Positioning**: Automatic layout within area boundaries
- **Row Wrapping**: Nodes automatically wrap to new rows when area width is exceeded
- **Resizable Areas**: Drag to resize area boundaries
- **Persistent Layout**: Area positions and sizes saved in localStorage

### 🎛️ **Control Panel**
- **Sidebar Interface**: Collapsible control panel
- **Device Management**: Add/delete devices with names and locations
- **Manual Placement**: Click-to-place mode for precise positioning
- **Area Controls**: Show/hide areas, reset layout
- **Real-time Feedback**: Status updates and loading indicators

### 📱 **Modern UI/UX**
- **Responsive Design**: Works on desktop and tablet
- **Tailwind CSS**: Beautiful, consistent styling
- **Dark Theme**: Professional dark sidebar with light main area
- **Smooth Animations**: Transitions and hover effects
- **Loading States**: User feedback during operations

## 🏗️ Architecture

```
┌─────────────────────┐
│   Next.js Frontend  │
├─────────────────────┤
│  📄 Pages           │
│  ├── / (Dashboard)  │
│  ├── /broadband     │ ◄── Main Network View
│  ├── /logs          │
│  └── /update        │
├─────────────────────┤
│  🧩 Components      │
│  ├── ControlPanel   │
│  ├── NodeTypes      │
│  ├── Areas          │
│  └── Header         │
├─────────────────────┤
│  🔗 API Routes      │
│  ├── /api/add       │ ◄── Device Management
│  ├── /api/delete    │
│  ├── /api/status    │ ◄── Real-time Data
│  └── /api/logs      │
└─────────────────────┘
         │
         ▼
  Backend API (Go)
```

## 📁 Project Structure

```
monitor/
├── app/
│   ├── page.tsx                 # Dashboard homepage
│   ├── layout.tsx              # App layout & navigation
│   ├── globals.css             # Global styles
│   ├── broadband/
│   │   └── page.tsx            # Main network visualization
│   ├── logs/
│   │   └── page.tsx            # Status change logs
│   ├── update/
│   │   └── page.tsx            # Device management
│   ├── api/                    # Next.js API routes
│   │   ├── add/route.ts        # Add device endpoint
│   │   ├── delete/route.ts     # Delete device endpoint
│   │   ├── status/route.ts     # Device status endpoint
│   │   └── logs/route.ts       # Logs endpoint
│   └── components/
│       ├── ControlPanel.tsx    # Sidebar controls
│       ├── NodeTypes.tsx       # Device node components
│       ├── areas.tsx           # Area type definitions
│       ├── initialData.ts      # Network areas config
│       └── header.tsx          # Navigation header
├── public/                     # Static assets
├── package.json               # Dependencies
├── tailwind.config.ts         # Tailwind configuration
├── tsconfig.json             # TypeScript configuration
└── next.config.ts            # Next.js configuration
```

## 🚀 Setup & Installation

### Prerequisites
- Node.js 18+
- npm or yarn
- Backend server running on `localhost:8080`

### 1. Install Dependencies
```bash
cd monitor
npm install
```

### 2. Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Production Build
```bash
npm run build
npm start
```

## 🎮 Usage Guide

### Main Dashboard (`/broadband`)

#### **Adding Devices**
1. Click the **sidebar toggle** (☰) in top-right
2. Enter **IP address** and **device name**
3. Select **area/location** from dropdown
4. Click **"Add Device"**

#### **Deleting Devices**
1. Open the **Control Panel**
2. Enter **IP address** to delete
3. Click **"Delete Device"**

#### **Manual Placement**
1. Click **"Manual Placement Mode"**
2. Fill device form in Control Panel
3. Click anywhere on canvas to place

#### **Area Management**
- **Resize**: Drag area corners/edges
- **Toggle**: Show/hide areas button
- **Reset**: Restore default layout

### Device Status Page (`/`)
- View all devices with current status
- Real-time status updates
- Last seen timestamps
- Color-coded status indicators

### Logs Page (`/logs`)
- Global status change history
- Device-specific filtering
- Timestamp sorting
- Status change details

### Update Page (`/update`)
- Alternative device management interface
- Bulk device operations
- System update checks

## 🎨 Styling & Theming

### Color Scheme
- **Areas**: Bold, distinct colors for each area
- **Devices**: Green (online) / Red (offline)
- **UI**: Dark sidebar, light main area
- **Accents**: Blue for interactive elements

### Area Colors
```typescript
PGCIL: '#1d4ed8' (Bold Blue)
Sophos: '#dc2626' (Bold Red)
Plant Area: '#7c3aed' (Bold Purple)
IT Dept: '#ea580c' (Bold Orange)
// ... and 7 more unique colors
```

### Responsive Design
- **Desktop**: Full sidebar and main area
- **Tablet**: Collapsible sidebar
- **Mobile**: Touch-friendly controls

## 💾 Data Persistence

### LocalStorage Keys
- `network-monitor-nodes`: Node positions and data
- `network-monitor-edges`: Connection data
- Area positions and dimensions

### Data Sync
- **Fetch on Load**: Gets latest device data from backend
- **Auto Refresh**: Updates every 30 seconds
- **Manual Refresh**: Via Control Panel actions
- **Persistence**: Layout changes saved locally

## 🔄 Real-time Features

### Status Updates
```typescript
// Automatic refresh every 30 seconds
setInterval(async () => {
  const deviceNodes = await fetchDeviceData();
  updateNetworkView(deviceNodes);
}, 30000);
```

### Node Positioning
- **Smart Layout**: Calculates optimal rows per area
- **Boundary Respect**: Nodes stay within area limits
- **Dynamic Sizing**: Adapts to area dimensions

## 🧩 Key Components

### ControlPanel.tsx
- **Sidebar interface** with device management
- **Form validation** and error handling
- **Real-time feedback** for operations

### NodeTypes.tsx
- **Custom node components** for devices
- **Status visualization** with colors
- **Tooltip integration** for device details

### BroadbandFlow (page.tsx)
- **Main visualization logic**
- **React Flow integration**
- **State management** for nodes/edges/areas

## 🎯 Network Areas

### Current Configuration
1. **Row 1**: PGCIL, Sophos, Hop Bung, SSC Build
2. **Row 2**: Plant Area, IT Dept, Admin Build  
3. **Row 3**: Sankalp #2, Township, ET-Hostel, RLI Office

### Area Specifications
- **Size Based on Capacity**: Larger areas for more devices
- **Strategic Positioning**: Logical network flow
- **Visual Hierarchy**: Important areas prominently placed

## 📊 Data Flow

```
User Action → Control Panel → API Call → Backend → Redis
     ↓              ↓           ↓          ↓         ↓
UI Update ← State Update ← Response ← Processing ← Storage
```

## 🛠️ Development

### Available Scripts
- `npm run dev` - Development server
- `npm run build` - Production build
- `npm run start` - Production server
- `npm run lint` - ESLint checks

### Key Dependencies
- **Next.js 15** - React framework
- **@xyflow/react** - Network visualization
- **Tailwind CSS** - Styling
- **TypeScript** - Type safety
- **Lucide React** - Icons

## 🐛 Troubleshooting

### Common Issues

**Nodes Not Updating**
- Check backend server status
- Verify API endpoints are accessible
- Clear localStorage and refresh

**Layout Issues**
- Use "Reset Layout" in Control Panel
- Clear browser cache
- Check area dimensions in `initialData.ts`

**Performance Issues**
- Reduce auto-refresh interval
- Limit number of devices per area
- Check browser dev tools for errors

## 🔮 Future Enhancements

- **Real-time WebSocket updates**
- **Advanced filtering and search**
- **Custom area creation**
- **Export network diagrams**
- **Mobile app version**
- **Advanced analytics dashboard**
- **Multi-tenant support**

---

**Built for NTPC Network Infrastructure Visualization**
