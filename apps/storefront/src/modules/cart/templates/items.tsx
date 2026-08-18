import repeat from "@lib/util/repeat"
import { HttpTypes } from "@medusajs/types"
import { Heading, Table } from "@modules/common/components/ui"

import Item from "@modules/cart/components/item"
import SkeletonLineItem from "@modules/skeletons/components/skeleton-line-item"

type ItemsTemplateProps = {
  cart?: HttpTypes.StoreCart
}

const ItemsTemplate = ({ cart }: ItemsTemplateProps) => {
  const items = cart?.items
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-4 small:p-6 shadow-sm">
      <div className="mb-5 flex flex-col gap-2 small:flex-row small:items-end small:justify-between">
        <div>
          <p className="jw-eyebrow text-ui-fg-subtle">Your cart</p>
          <Heading className="mt-2 text-2xl small:text-[2rem] small:leading-[2.75rem] text-ui-fg-base">
            Cart
          </Heading>
        </div>
        <p className="text-small-regular text-ui-fg-muted max-w-[18rem]">
          Review quantities, remove items, or continue shopping before checkout.
        </p>
      </div>

      <div className="space-y-3 small:hidden">
        {items
          ? items
              .sort((a, b) => {
                return (a.created_at ?? "") > (b.created_at ?? "") ? -1 : 1
              })
              .map((item) => (
                <Item
                  key={item.id}
                  item={item}
                  currencyCode={cart?.currency_code}
                  layout="card"
                />
              ))
          : repeat(5).map((i) => {
              return <SkeletonLineItem key={i} />
            })}
      </div>

      <div className="hidden small:block">
        <Table>
          <Table.Header className="border-t-0">
            <Table.Row className="text-ui-fg-subtle txt-medium-plus">
              <Table.HeaderCell className="!pl-0">Item</Table.HeaderCell>
              <Table.HeaderCell></Table.HeaderCell>
              <Table.HeaderCell>Quantity</Table.HeaderCell>
              <Table.HeaderCell className="hidden small:table-cell">
                Price
              </Table.HeaderCell>
              <Table.HeaderCell className="!pr-0 text-right">
                Total
              </Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {items
              ? items
                  .sort((a, b) => {
                    return (a.created_at ?? "") > (b.created_at ?? "") ? -1 : 1
                  })
                  .map((item) => {
                    return (
                      <Item
                        key={item.id}
                        item={item}
                        currencyCode={cart?.currency_code}
                      />
                    )
                  })
              : repeat(5).map((i) => {
                  return <SkeletonLineItem key={i} />
                })}
          </Table.Body>
        </Table>
      </div>
    </div>
  )
}

export default ItemsTemplate
