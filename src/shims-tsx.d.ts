import Vue, { VNode } from 'vue';

declare module '*.png';
declare module '*.svg';
declare module '*.svg' {
  const content: any;
  export default content;
}

declare global {
  namespace JSX {
    // tslint:disable no-empty-interface
    interface Element extends VNode {}
    // tslint:disable no-empty-interface
    interface ElementClass extends Vue {}
    interface IntrinsicElements {
      [elem: string]: any;
    }
  }
}
