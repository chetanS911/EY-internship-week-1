import React from 'react';
import styled from 'styled-components';

function Dashboard() {
  const items = [
    {
      id: 1,
      title: "Vintage Watch",
      image: "/images/watch.jpg",
      description: "Luxury vintage timepiece",
      price: "75,000",
      currentBid: "78,000"
    },
    {
      id: 2,
      title: "Classic Car",
      image: "/images/cars.jpg",
      description: "Restored classic automobile",
      price: "15,00,000",
      currentBid: "16,25,000"
    },
    {
      id: 3,
      title: "Antique Furniture",
      image: "/images/furniture.jpg",
      description: "Victorian-era furniture",
      price: "1,50,000",
      currentBid: "1,65,000"
    },
    {
      id: 4,
      title: "Art Painting",
      image: "/images/art.jpg",
      description: "Original oil painting",
      price: "2,50,000",
      currentBid: "2,75,000"
    },
    {
      id: 5,
      title: "Rare Coins",
      image: "/images/coin.jpg",
      description: "Historical coin collection",
      price: "95,000",
      currentBid: "1,05,000"
    },
    {
      id: 6,
      title: "vintage camera",
      image: "/images/camera.jpg",
      description: "Historical vintage camera",
      price: "15,000",
      currentBid: "16,900"
    }
    
  ];

  return (
    <DashboardContainer>
      <h1>Featured Items</h1>
      <ItemGrid>
        {items.map((item) => (
          <ItemCard key={item.id}>
            <ItemImage src={item.image} alt={item.title} />
            <ItemTitle>{item.title}</ItemTitle>
            <ItemDescription>{item.description}</ItemDescription>
            <PriceContainer>
              <PriceInfo>
                <PriceLabel>Starting Price:</PriceLabel>
                <Price>₹{item.price}</Price>
              </PriceInfo>
              <PriceInfo>
                <PriceLabel>Current Bid:</PriceLabel>
                <CurrentBid>₹{item.currentBid}</CurrentBid>
              </PriceInfo>
            </PriceContainer>
            <BidButton>Place Bid</BidButton>
          </ItemCard>
        ))}
      </ItemGrid>
    </DashboardContainer>
  );
}

const DashboardContainer = styled.div`
  padding: 20px;
  background-color: #f5f5f5;

  h1 {
    text-align: center;
    color: #333;
    margin-bottom: 30px;
  }
`;

const ItemGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  max-width: 1200px;
  margin: 0 auto;
`;

const ItemCard = styled.div`
  background: white;
  border-radius: 10px;
  padding: 15px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-5px);
  }
`;

const ItemImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 10px;
`;

const ItemTitle = styled.h2`
  font-size: 1.2rem;
  color: #333;
  margin: 10px 0;
`;

const ItemDescription = styled.p`
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 15px;
`;

const PriceContainer = styled.div`
  margin: 15px 0;
  padding: 10px;
  background-color: #f8f9fa;
  border-radius: 6px;
`;

const PriceInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const PriceLabel = styled.span`
  color: #666;
  font-size: 0.9rem;
`;

const Price = styled.span`
  color: #2c3e50;
  font-weight: bold;
  font-size: 1rem;
`;

const CurrentBid = styled.span`
  color: #2ecc71;
  font-weight: bold;
  font-size: 1rem;
`;

const BidButton = styled.button`
  width: 100%;
  padding: 10px;
  background-color: #4a90e2;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #357abd;
  }
`;

export default Dashboard;
