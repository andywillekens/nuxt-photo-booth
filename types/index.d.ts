export { Picture }

declare global {
  type Picture = {
    name: string
    data: string
    alt: string
    ext: string
  }
}
