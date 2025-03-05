export interface Compiler {
  id?: number;  
  command: string;
  language: {
    id: number;
    name: string;
    version: string;
  };
}
