import { getProducts } from '@/lib/actions/products'
import { ProductsTable } from '@/components/products-table'

export default async function ProductsPage() {
  const { products, total } = await getProducts({ limit: 20 })

  return (
    <div className="p-6">
      <ProductsTable initialProducts={products} initialTotal={total} />
    </div>
  )
}
