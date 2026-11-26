import { WebPartContext } from "@microsoft/sp-webpart-base";


export type NameMode = 'first' | 'last' | 'both';
export type SourceFormat = 'auto' | 'firstLast' | 'lastFirst';
export type BothOrder = 'firstLast' | 'lastFirst';

export interface IPersonalGreetingProps {
  greetingText: string;
  context: WebPartContext;
  position: string;
  textColor: string;
  fontSize: number;
  bold: boolean;
  italic: boolean;
  underline: boolean;
  nameMode: NameMode;
  sourceFormat: SourceFormat;
  bothOrder: BothOrder;
}
