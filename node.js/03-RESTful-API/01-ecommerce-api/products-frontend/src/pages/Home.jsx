import React, { useEffect, useState } from 'react'
import ProductCard from '../components/ProductCard';

const Home = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        // Replace this URL with your own API URL
        fetch('http://localhost:3000/products')
            .then(res => res.json())
            .then(setProducts)
            .catch(console.error);
    }, []);

    return (
        <div className='container mx-auto px-4 py-8'>
            <h1 className='text-3xl font-bold mb-6 text-center'>Featured Products</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {products.map(product => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </div>
    )
}

export default Home