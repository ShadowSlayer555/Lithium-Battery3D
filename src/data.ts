export type ElementGroup = 'alkali' | 'transition' | 'nonmetal' | 'post-transition';

export interface ChemElement {
  id: string;
  symbol: string;
  name: string;
  atomicNumber: number;
  group: ElementGroup;
}

export const CHEM_ELEMENTS: Record<string, ChemElement> = {
  li: { id: 'li', symbol: 'Li', name: 'Lithium', atomicNumber: 3, group: 'alkali' },
  co: { id: 'co', symbol: 'Co', name: 'Cobalt', atomicNumber: 27, group: 'transition' },
  al: { id: 'al', symbol: 'Al', name: 'Aluminum', atomicNumber: 13, group: 'post-transition' },
  o: { id: 'o',  symbol: 'O',  name: 'Oxygen', atomicNumber: 8, group: 'nonmetal' },
  fe: { id: 'fe', symbol: 'Fe', name: 'Iron', atomicNumber: 26, group: 'transition' },
  p: { id: 'p',  symbol: 'P',  name: 'Phosphorus', atomicNumber: 15, group: 'nonmetal' },
  f: { id: 'f',  symbol: 'F',  name: 'Fluorine', atomicNumber: 9, group: 'nonmetal' },
  c: { id: 'c',  symbol: 'C',  name: 'Carbon', atomicNumber: 6, group: 'nonmetal' },
  h: { id: 'h',  symbol: 'H',  name: 'Hydrogen', atomicNumber: 1, group: 'nonmetal' },
  cu: { id: 'cu', symbol: 'Cu', name: 'Copper', atomicNumber: 29, group: 'transition' },
};

export type VisualType = 'outer-casing' | 'cathode' | 'cathode-collector' | 'electrolyte' | 'separator' | 'anode' | 'anode-collector';

export interface LayerInfo {
  id: string;
  title: string;
  role: string;
  description: string;
  visualType: VisualType;
  elements: ChemElement[];
}

export const LAYERS: LayerInfo[] = [
  {
    id: 'outer-casing',
    title: 'Top Casing',
    role: 'Protective Shell',
    description: 'Aluminum or Steel protective shell containing the internal components, acting as a highly structural barrier preventing exposure to air or moisture.',
    visualType: 'outer-casing',
    elements: [CHEM_ELEMENTS.al, CHEM_ELEMENTS.fe],
  },
  {
    id: 'cathode-collector',
    title: 'Cathode Collector',
    role: 'Electron Transporter',
    description: 'A thin aluminum foil that collects electrons from the cathode active material and transports them to the external circuit.',
    visualType: 'cathode-collector',
    elements: [CHEM_ELEMENTS.al],
  },
  {
    id: 'cathode',
    title: 'Cathode Active',
    role: 'Positive Electrode',
    description: 'Lithium metal oxide (like LiCoO2) coated onto the aluminum collector. It hosts lithium ions during discharge.',
    visualType: 'cathode',
    elements: [CHEM_ELEMENTS.li, CHEM_ELEMENTS.co, CHEM_ELEMENTS.o],
  },
  {
    id: 'electrolyte',
    title: 'Electrolyte',
    role: 'Ion Transporter',
    description: 'A liquid lithium salt solvent allowing the rapid transport of lithium ions between the cathode and anode, while preventing electron flow.',
    visualType: 'electrolyte',
    elements: [CHEM_ELEMENTS.li, CHEM_ELEMENTS.p, CHEM_ELEMENTS.f],
  },
  {
    id: 'separator',
    title: 'Separator',
    role: 'Safety Barrier',
    description: 'A permeable micro-porous polymer membrane. It acts as a safety barrier preventing short circuits by physically separating the anode and cathode while letting ions pass.',
    visualType: 'separator',
    elements: [CHEM_ELEMENTS.c, CHEM_ELEMENTS.h],
  },
  {
    id: 'anode',
    title: 'Anode Active',
    role: 'Negative Electrode',
    description: 'Graphite coating that stores lithium ions during the charging phase and releases them to power the device.',
    visualType: 'anode',
    elements: [CHEM_ELEMENTS.c],
  },
  {
    id: 'anode-collector',
    title: 'Anode Collector',
    role: 'Electron Transporter',
    description: 'A thin copper foil that collects electrons from the external circuit and distributes them into the graphite anode.',
    visualType: 'anode-collector',
    elements: [CHEM_ELEMENTS.cu],
  }
];
