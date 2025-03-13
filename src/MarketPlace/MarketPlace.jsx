import React, { useState } from 'react';
import './MarketPlace.css';

// Import images from assets
import compostImg from '.././assets/compost.jpg';
import seedsImg from '.././assets/seeds.jpg';
import vermicompostImg from '.././assets/vermicompost.jpeg';
import opImg from '.././assets/op.jpg';

const MarketPlace = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const suggestions = ['Upload', 'Community', 'ChatExpert', 'Market', 'History'];

  // Updated products using asset images
  const products = [
    {
      id: 1,
      title: 'Organic Pesticide',
      description: 'Eco-friendly pesticide made from natural ingredients, ensuring your crops remain protected without harming the environment.',
      price: '₹450',
      image: opImg,
    },
    {
      id: 2,
      title: 'Natural Fertilizer',
      description: 'Compost-based fertilizer to enrich soil quality and promote healthy crop growth.',
      price: '₹300',
      image: vermicompostImg,
    },
    {
      id: 3,
      title: 'Climate-Resilient Seeds',
      description: 'High-quality seeds designed to withstand extreme weather, ensuring crop productivity even in challenging climates.',
      price: '₹200',
      image: seedsImg,
    },
    {
      id: 4,
      title: 'Compost for Fertilizer',
      description: 'Sustainable compost that boosts soil health, perfect for organic farming and gardening.',
      price: '₹350',
      image: compostImg,
    },
  ];

  return (
    <div className="market-container">
      <h1>Marketplace for Sustainable Farming Products</h1>
      <p>Welcome to the Eco-Friendly Store: A marketplace for sustainable farming products where you can buy and sell organic items.</p>
      <p>Browse through the following categories:</p>
      <ul>
        <li>Organic Pesticides</li>
        <li>Natural Fertilizers & Compost</li>
        <li>Climate-Resilient Seeds</li>
      </ul>
      <p>We also encourage recycling and waste management:</p>
      <ul>
        <li>Farmers can sell crop waste for composting or animal feed.</li>
      </ul>
      <p>More exciting features will be added soon!</p>

      <div className="search-bar">
        <input 
          type="text" 
          placeholder="Search for products..." 
          value={searchTerm} 
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {searchTerm && (
          <ul className="suggestions">
            {suggestions
              .filter(item => item.toLowerCase().includes(searchTerm.toLowerCase()))
              .map((suggestion, index) => (
                <li key={index}>{suggestion}</li>
            ))}
          </ul>
        )}
      </div>

      <div className="sell-button">
        <button className="sell-your-product-btn">Sell Your Product</button>
      </div>

      <div className="product-cards">
        {products
          .filter(product =>
            product.title.toLowerCase().includes(searchTerm.toLowerCase())
          )
          .map((product) => (
            <div key={product.id} className="product-card">
              <img src={product.image} alt={product.title} className="product-image" />
              <div className="product-info">
                <h3>{product.title}</h3>
                <p>{product.description}</p>
                <p className="price">{product.price}</p>
                <div className="action-buttons">
                  <button className="buy-now-btn">Buy Now</button>
                </div>
              </div>
            </div>
        ))}
      </div>
    </div>
  );
};

export default MarketPlace;
