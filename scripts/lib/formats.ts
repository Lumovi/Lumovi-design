// Encoders for the file formats that browsers don't make: Windows .ico, macOS .icns, the
// .bmp NSIS installers take, and Adobe's .ase swatches. Each is a small container format, so
// they're written here rather than through more dependencies, and come out the same each time.

/** A Windows icon, with a PNG for each size (Windows Vista and later read PNG entries). */
export function ico(images: { size: number; png: Buffer }[]): Buffer {
  const header = Buffer.alloc(6 + images.length * 16)
  header.writeUInt16LE(0, 0) // reserved
  header.writeUInt16LE(1, 2) // type: icon
  header.writeUInt16LE(images.length, 4)
  let offset = header.length
  images.forEach(({ size, png }, i) => {
    const entry = 6 + i * 16
    header.writeUInt8(size >= 256 ? 0 : size, entry) // width (0 means 256)
    header.writeUInt8(size >= 256 ? 0 : size, entry + 1) // height
    header.writeUInt8(0, entry + 2) // palette size
    header.writeUInt8(0, entry + 3) // reserved
    header.writeUInt16LE(1, entry + 4) // color planes
    header.writeUInt16LE(32, entry + 6) // bits per pixel
    header.writeUInt32LE(png.length, entry + 8)
    header.writeUInt32LE(offset, entry + 12)
    offset += png.length
  })
  return Buffer.concat([header, ...images.map((image) => image.png)])
}

/**
 * The PNG types of a macOS icon, by pixel size: the same set `iconutil` writes from an
 * .iconset (16 to 512 points, at 1x and 2x).
 */
export const ICNS_TYPES: [type: string, size: number][] = [
  ['icp4', 16],
  ['ic11', 32], // 16@2x
  ['icp5', 32],
  ['ic12', 64], // 32@2x
  ['ic07', 128],
  ['ic13', 256], // 128@2x
  ['ic08', 256],
  ['ic14', 512], // 256@2x
  ['ic09', 512],
  ['ic10', 1024], // 512@2x
]

/** A macOS icon from a PNG per size (keyed by pixel size). */
export function icns(pngs: Map<number, Buffer>): Buffer {
  const chunks = ICNS_TYPES.map(([type, size]) => {
    const png = pngs.get(size)
    if (!png) throw new Error(`icns: no ${size}px image`)
    const head = Buffer.alloc(8)
    head.write(type, 0, 'latin1')
    head.writeUInt32BE(png.length + 8, 4)
    return Buffer.concat([head, png])
  })
  const body = Buffer.concat(chunks)
  const head = Buffer.alloc(8)
  head.write('icns', 0, 'latin1')
  head.writeUInt32BE(body.length + 8, 4)
  return Buffer.concat([head, body])
}

/** A 24-bit BMP from RGBA pixels, flattened onto a background color. */
export function bmp(
  { data, width, height }: { data: Buffer; width: number; height: number },
  background: [number, number, number],
): Buffer {
  const rowSize = Math.ceil((width * 3) / 4) * 4
  const pixels = Buffer.alloc(rowSize * height)
  for (let y = 0; y < height; y++) {
    // BMP rows run bottom to top, in BGR order.
    const row = (height - 1 - y) * rowSize
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4
      const a = data[i + 3]! / 255
      const mix = (c: number, bg: number) => Math.round(c * a + bg * (1 - a))
      pixels[row + x * 3] = mix(data[i + 2]!, background[2])
      pixels[row + x * 3 + 1] = mix(data[i + 1]!, background[1])
      pixels[row + x * 3 + 2] = mix(data[i]!, background[0])
    }
  }
  const header = Buffer.alloc(54)
  header.write('BM', 0, 'latin1')
  header.writeUInt32LE(54 + pixels.length, 2)
  header.writeUInt32LE(54, 10) // pixel data offset
  header.writeUInt32LE(40, 14) // BITMAPINFOHEADER
  header.writeInt32LE(width, 18)
  header.writeInt32LE(height, 22)
  header.writeUInt16LE(1, 26) // planes
  header.writeUInt16LE(24, 28) // bits per pixel
  header.writeUInt32LE(pixels.length, 34)
  header.writeInt32LE(2835, 38) // 72 dpi
  header.writeInt32LE(2835, 42)
  return Buffer.concat([header, pixels])
}

/** Adobe Swatch Exchange: named RGB swatches in groups, for Illustrator, Photoshop and InDesign. */
export function ase(groups: { name: string; colors: { name: string; hex: string }[] }[]): Buffer {
  const blocks: Buffer[] = []
  const utf16 = (text: string) => {
    const b = Buffer.alloc((text.length + 1) * 2 + 2)
    b.writeUInt16BE(text.length + 1, 0)
    for (let i = 0; i < text.length; i++) b.writeUInt16BE(text.charCodeAt(i), 2 + i * 2)
    return b // ends with a null character
  }
  const block = (type: number, body: Buffer) => {
    const head = Buffer.alloc(6)
    head.writeUInt16BE(type, 0)
    head.writeUInt32BE(body.length, 2)
    blocks.push(head, body)
  }
  let count = 0
  for (const group of groups) {
    block(0xc001, utf16(group.name))
    count++
    for (const color of group.colors) {
      const values = Buffer.alloc(4 + 12 + 2)
      values.write('RGB ', 0, 'latin1')
      for (let i = 0; i < 3; i++) {
        values.writeFloatBE(parseInt(color.hex.slice(1 + i * 2, 3 + i * 2), 16) / 255, 4 + i * 4)
      }
      values.writeUInt16BE(2, 16) // a normal (process) color
      block(0x0001, Buffer.concat([utf16(color.name), values]))
      count++
    }
    block(0xc002, Buffer.alloc(0))
    count++
  }
  const head = Buffer.alloc(12)
  head.write('ASEF', 0, 'latin1')
  head.writeUInt16BE(1, 4)
  head.writeUInt16BE(0, 6)
  head.writeUInt32BE(count, 8)
  return Buffer.concat([head, ...blocks])
}
