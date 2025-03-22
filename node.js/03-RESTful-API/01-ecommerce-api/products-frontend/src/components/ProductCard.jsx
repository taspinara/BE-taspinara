
const ProductCard = ({ product }) => {
  return (
    <div className="card w-full bg-base-100 shadow-xl">
        <figure>
            <img src={product.image} alt={product.name} className="h-48 object-cover" />
        </figure>
        <div className="card-body">
            <h2 className="card-title">{product.title}</h2>
            <p>{product.description}</p>
            <div className="flex justify-between items-center mt-2">
                <span className="text-lg font-bold">${product.price}</span>
                <span className="badge badge-outline">${product.category}</span>
            </div>
            <div className="card-actions justify-end">
                <button className="btn btn-primary">View</button>
            </div>
        </div>
    </div>
  )
}

export default ProductCard