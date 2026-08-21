export function shouldBuildStaticCatalogPages() {
  return process.env.NEXT_PUBLIC_BUILD_STATIC_CATALOG_PAGES === "true"
}
