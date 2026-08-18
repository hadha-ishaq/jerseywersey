const SkeletonProductPreview = () => {
  return (
    <div className="flex h-full flex-col">
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-offwhite">
        <div className="h-full w-full animate-pulse bg-neutral-100" />
      </div>
      <div className="mt-4 flex flex-1 flex-col gap-2">
        <div className="h-2.5 w-1/3 animate-pulse bg-neutral-100" />
        <div className="h-3.5 w-3/4 animate-pulse bg-neutral-100" />
        <div className="h-3.5 w-1/4 animate-pulse bg-neutral-100" />
      </div>
    </div>
  )
}

export default SkeletonProductPreview