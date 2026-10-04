// wawoff2 (WOFF2 to and from TrueType, as WebAssembly) ships without types.
declare module 'wawoff2' {
  const wawoff2: {
    decompress(woff2: Uint8Array): Promise<Uint8Array>
    compress(ttf: Uint8Array): Promise<Uint8Array>
  }
  export default wawoff2
}
