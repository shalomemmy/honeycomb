// Global type declarations to fix build issues

declare global {
  interface Window {
    solana?: any;
    phantom?: any;
    solflare?: any;
    backpack?: any;
    glow?: any;
    slope?: any;
    sollet?: any;
    ethereum?: any;
    trustwallet?: any;
    coinbaseSolana?: any;
    coin98?: any;
    exodus?: any;
    torus?: any;
  }
}

// Fix for @types/web build issue
declare module '*.svg' {
  const content: string;
  export default content;
}

declare module '*.png' {
  const content: string;
  export default content;
}

declare module '*.jpg' {
  const content: string;
  export default content;
}

export {};