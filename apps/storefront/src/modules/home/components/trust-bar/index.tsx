import { HOMEPAGE } from "@lib/brand"

const TrustBar = () => {
  const items = [
    {
      title: "Authentic Kits",
      description: "Licensed quality you can trust",
    },
    {
      title: "India Delivery",
      description: "Delivered across India",
    },
    {
      title: "Secure Checkout",
      description: "Pay safe, shop easy",
    },
    {
      title: "Easy Returns",
      description: "Clear return support",
    },
  ]

  return (
    <section className="bg-white py-16 small:py-20">
      <div className="content-container">
        <h2 className="jw-eyebrow text-neutral-900 mb-10">
          {HOMEPAGE.trustTitle}
        </h2>
        <div className="grid grid-cols-1 small:grid-cols-2 medium:grid-cols-4 gap-8">
          {items.map((item) => (
            <div key={item.title} className="flex flex-col gap-2">
              <span className="w-8 h-0.5 bg-jersey" />
              <h3 className="text-sm font-semibold uppercase tracking-widest">
                {item.title}
              </h3>
              <p className="text-sm text-neutral-500">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default TrustBar
