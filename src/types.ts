export interface SvgDef {
  type: string;
  attrs: Record<string, unknown>;
  id?: string;
  text?: string;
  events?: Record<string, EventHandler | EventHandler[]>;
  children?: SvgDef[];
}

export type EventHandler =
  | ((event: Event) => void)
  | { callback: (event: Event) => void; options?: AddEventListenerOptions };
