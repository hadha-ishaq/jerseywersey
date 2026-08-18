import { HttpTypes } from "@medusajs/types"
import { Text, clx } from "@modules/common/components/ui"

type LineItemOptionsProps = {
  variant: HttpTypes.StoreProductVariant | undefined
  "data-testid"?: string
  "data-value"?: HttpTypes.StoreProductVariant
  className?: string
}

const LineItemOptions = ({
  variant,
  "data-testid": dataTestid,
  "data-value": dataValue,
  className,
}: LineItemOptionsProps) => {
  return (
    <Text
      data-testid={dataTestid}
      data-value={dataValue}
      className={clx(
        "inline-block w-full overflow-hidden text-ellipsis txt-medium text-ui-fg-subtle",
        className
      )}
    >
      Variant: {variant?.title}
    </Text>
  )
}

export default LineItemOptions
