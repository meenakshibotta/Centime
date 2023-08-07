export interface Node {
    name: string; category: string;
}

export interface Link{
    
        source: string,
        target: string,
        value: number
}

export type Inflow_outflow = {
    nodes: Node[];
    links: Link[];
  };

  
  export interface Locales {
    "en": { title: string; }; "lv": { title: string; }; "es": { title: string; }; }
  