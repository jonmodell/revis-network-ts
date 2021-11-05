/*
In this example, the decorations width and height values must be set to the acutal 
dimensions of the image being used.
*/
export default {
  nodes: [
    {
      id: 'VG9wb0VsZW1lbnQhTiExNg==',
      type: 'TopoElement',
      image: 'topoElement',
      label: 'A',
      innerLabel: 'A',
      status: 'unknown',
      style: {
        border: '#707070',
      },
      shape: 'diamond',
      expanded: true,
      fixed: false,
    },
    {
      id: 'QXBwQ29tcCFOITI1',
      type: 'AppComp',
      image: 'appComp',
      label: 'Size 60',
      innerLabel: 'B',
      status: 'unknown',
      style: {
        border: '#707070',
        size: 60,
      },
      shape: 'diamond',
      expanded: true,
      fixed: false,
    },
    {
      id: 'QXBwQ29tcCFOITI3',
      type: 'AppComp',
      image: 'appComp',
      label: 'C',
      innerLabel: 'C',
      status: 'unknown',
      style: {
        border: '#707070',
      },
      borderWidth: 0,
      shape: 'diamond',
      fixed: false,
    },
    {
      id: 'QXBwQ29tcCFOITI4',
      type: 'AppComp',
      image: 'appComp',
      label: 'D really long long long label',
      innerLabel: 'D really long long long label',
      status: 'unknown',
      style: {
        border: '#707070',
      },
      borderWidth: 0,
      shape: 'hexagon',
      expanded: true,
      fixed: false,
    },
    {
      id: 'QXBwQ29tcCFOITM1',
      type: 'AppComp',
      image: 'appComp',
      label: 'BDS php',
      innerLabel: 'BDS php',
      status: 'unknown',
      style: {
        border: '#707070',
      },
      borderWidth: 0,
      shape: 'diamond',
      fixed: false,
    },
    {
      id: 'QXBwQ29tcCFOITQy',
      type: 'AppComp',
      image: 'appComp',
      label: 'ww',
      innerLabel: 'ww',
      status: 'unknown',
      style: {
        border: '#707070',
      },
      borderWidth: 0,
      shape: 'diamond',
      fixed: false,
    },
    {
      id: 'RGV2aWNlIU4hMQ==',
      type: 'Device',
      image: 'device',
      label: 'Size 60 square',
      innerLabel: 'fh-sl1-iso-cn-51',
      status: 'Healthy',
      style: {
        border: '#53B749',
        size: 60,
      },
      borderWidth: 0,
      img: '/images/map-device.svg',
      Name: 'fh-sl1-iso-cn-51',
      shape: 'square',
      fixed: false,
      tiered: false,
    },
    {
      id: 'RGV2aWNlIU4hMg==',
      type: 'Device',
      image: 'device',
      label: 'fh-sl1-iso-db-50',
      innerLabel: 'fh-sl1-iso-db-50',
      status: 'Healthy',
      style: {
        background: 'rgba(255,255,255,1)',
        border: '#53B749',
      },
      borderWidth: 0,
      img: 'cjn52lhip00003h63porig9go',
      Name: 'fh-sl1-iso-db-50',
      shape: 'square',
      fixed: false,
      tiered: false,
    },
  ],
  edges: [
    {
      id: 'VG9wb0VsZW1lbnQhTiExNg==!R!Contains!R!QXBwQ29tcCFOITI3',
      from: 'VG9wb0VsZW1lbnQhTiExNg==',
      to: 'QXBwQ29tcCFOITI3',
      title: 'Contains',
      type: 'Contains',
      label: 'Contains',
      size: 1,
    },
    {
      id: 'VG9wb0VsZW1lbnQhTiExNg==!R!Contains!R!QXBwQ29tcCFOITI3X',
      from: 'VG9wb0VsZW1lbnQhTiExNg==',
      to: 'QXBwQ29tcCFOITI3',
      title: 'Duplicate',
      type: 'Duplicate',
      label: 'Duplicate',
      size: 1,
    },
    {
      id: 'VG9wb0VsZW1lbnQhTiExNg==!R!Contains!R!QXBwQ29tcCFOITI4',
      from: 'VG9wb0VsZW1lbnQhTiExNg==',
      to: 'QXBwQ29tcCFOITI4',
      title: 'Contains',
      type: 'Contains',
      label: 'Contains',
      size: 1,
    },
    {
      id: 'VG9wb0VsZW1lbnQhTiExNg==!R!Contains!R!QXBwQ29tcCFOITM1',
      from: 'VG9wb0VsZW1lbnQhTiExNg==',
      to: 'QXBwQ29tcCFOITM1',
      title: 'Contains',
      type: 'Contains',
      label: 'Contains',
      size: 1,
    },
    {
      id: 'QXBwQ29tcCFOITI4!R!Matched!R!QXBwQ29tcCFOITQy',
      from: 'QXBwQ29tcCFOITI4',
      to: 'QXBwQ29tcCFOITQy',
      title: 'Matched',
      type: 'Matched',
      label: 'Matched',
      size: 1,
    },
    {
      id: 'QXBwQ29tcCFOITI1!R!Matched!R!QXBwQ29tcCFOITQy',
      from: 'QXBwQ29tcCFOITI1',
      to: 'QXBwQ29tcCFOITQy',
      title: 'Matched',
      type: 'Matched',
      label: 'Matched',
      size: 1,
    },
    {
      id: 'QXBwQ29tcCFOITI4!R!DetectedBy!R!RGV2aWNlIU4hMQ==',
      from: 'QXBwQ29tcCFOITI4',
      to: 'RGV2aWNlIU4hMQ==',
      title: 'RunningOn',
      type: 'RunningOn',
      label: 'RunningOn',
      size: 1,
    },
    {
      id: 'QXBwQ29tcCFOITI1!R!DetectedBy!R!RGV2aWNlIU4hMQ==',
      from: 'QXBwQ29tcCFOITI1',
      to: 'RGV2aWNlIU4hMQ==',
      title: 'RunningOn',
      type: 'RunningOn',
      label: 'RunningOn',
      size: 1,
    },
    {
      id: 'QXBwQ29tcCFOITI4!R!DetectedBy!R!RGV2aWNlIU4hMg==',
      from: 'QXBwQ29tcCFOITI4',
      to: 'RGV2aWNlIU4hMg==',
      title: 'RunningOn',
      type: 'RunningOn',
      label: 'RunningOn',
      size: 1,
    },
    {
      id: 'QXBwQ29tcCFOITI1!R!DetectedBy!R!RGV2aWNlIU4hMg==',
      from: 'QXBwQ29tcCFOITI1',
      to: 'RGV2aWNlIU4hMg==',
      title: 'RunningOn',
      type: 'RunningOn',
      label: 'RunningOn',
      size: 1,
    },
  ],
};

export const shapes = [
  {
    id: 'back1',
    x: 0,
    y: 0,
    size: 100,
    shape: 'rectangle',
    style: { fill: '#ee4455', line: '#33ee33', lineWidth: 1 },
  },
  {
    id: 'back2',
    x: -500,
    y: 0,
    width: 200,
    height: 100,
    shape: 'cloud',
    style: { fill: '#ee4455', line: '#33ee33', lineWidth: 1 },
  },
  {
    id: 'back3',
    x: -200,
    y: 200,
    size: 100,
    shape: 'polygon',
    faces: 10,
    style: { fill: '#cc8811', line: '#33ee33', lineWidth: 1 },
  },
  {
    id: 'back4',
    x: -200,
    y: 0,
    size: 100,
    shape: 'circle',
    style: { fill: '#5544ee', line: '#222222', lineWidth: 2 },
  },
  {
    id: 't1',
    x: 300,
    y: 0,
    height: 40,
    width: 400,
    shape: 'text',
    text:
      '“If you’re not making a mistake, it’s a mistake.” – Miles Davis. \n\nIf you’re not making a mistake, it’s a mistake.” – Miles Davis',
    style: { fill: '#d3429e' },
    fontSize: 20,
    textAlign: 'center',
    background: true,
  },
  {
    id: 't2',
    x: 400,
    y: 100,
    height: 100,
    width: 400,
    shape: 'text',
    text:
      '“I\'m always thinking about creating. \nMy future starts when I wake up every morning... Every day I find something creative to do with my life" – Miles Davis',
    style: { fill: '#9e423e' },
    fontSize: 20,
    textAlign: 'left',
  },
  {
    id: 't3',
    x: 300,
    y: 300,
    height: 40,
    width: 400,
    shape: 'text',
    text:
      '“If you’re not making a mistake, it’s a mistake.” – Miles Davis. \nIf you’re not making a mistake, it’s a mistake.” – Miles Davis',
    style: { fill: '#d3009e' },
    fontSize: 20,
    textAlign: 'right',
  },
  {
    id: 'b6',
    x: 0,
    y: 200,
    width: 100,
    height: 300,
    shape: 'rectangle',
    style: { fill: '#44ee55', line: '#222222', lineWidth: 5 },
  },
];

export const image1 = new Image();
image1.src =
  'data:image/svg+xml;charset=utf-8;base64,PHN2ZyB2ZXJzaW9uPSIxLjAiIGlkPSJhZ2VudCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgeD0iMHB4IiB5PSIwcHgiDQoJIHdpZHRoPSIxMXB4IiBoZWlnaHQ9IjExcHgiIHZpZXdCb3g9IjAgMCAxMSAxMSIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgMTEgMTE7IiB4bWw6c3BhY2U9InByZXNlcnZlIj4NCjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+DQoJLnN0MHtmaWxsOm5vbmU7c3Ryb2tlOiM5OTk5OTk7c3Ryb2tlLW1pdGVybGltaXQ6MTA7fQ0KCS5zdDF7ZmlsbDojOTk5OTk5O30NCjwvc3R5bGU+DQo8cGF0aCBjbGFzcz0ic3QwIiBkPSJNOSwxMC41SDJjLTAuMywwLTAuNS0wLjItMC41LTAuNVYxYzAtMC4zLDAuMi0wLjUsMC41LTAuNWg3YzAuMywwLDAuNSwwLjIsMC41LDAuNXY5QzkuNSwxMC4zLDkuMywxMC41LDksMTAuNQ0KCXoiLz4NCjxwb2x5bGluZSBjbGFzcz0ic3QwIiBwb2ludHM9IjMuNSwwLjUgMy41LDcgNC41LDguNSA0LjUsMTAuNSAiLz4NCjxwb2x5bGluZSBjbGFzcz0ic3QwIiBwb2ludHM9IjcuNSwwLjUgNy41LDcgNi41LDguNSA2LjUsMTAuNSAiLz4NCjxyZWN0IHg9IjUiIHk9IjIiIGNsYXNzPSJzdDEiIHdpZHRoPSIxIiBoZWlnaHQ9IjEiLz4NCjxyZWN0IHg9IjUiIHk9IjQiIGNsYXNzPSJzdDEiIHdpZHRoPSIxIiBoZWlnaHQ9IjEiLz4NCjxyZWN0IHg9IjUiIHk9IjYiIGNsYXNzPSJzdDEiIHdpZHRoPSIxIiBoZWlnaHQ9IjEiLz4NCjwvc3ZnPg==';

