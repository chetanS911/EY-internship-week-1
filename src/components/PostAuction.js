import React, { useState } from 'react';
import styled from 'styled-components';

function PostAuction() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startingPrice: '',
    reservePrice: '',
    startDate: '',
    endDate: '',
    category: '',
    itemCondition: '',
    images: [],
    location: ''
  });

  const categories = [
    'Antiques',
    'Art',
    'Automobiles',
    'Electronics',
    'Fashion',
    'Jewelry',
    'Collectibles',
    'Furniture'
  ];

  const conditions = [
    'New',
    'Like New',
    'Excellent',
    'Good',
    'Fair',
    'For Parts'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
      
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setFormData(prevState => ({
      ...prevState,
      images: files
    }));
  };

  return (
    <Container>
      <Title>Post New Auction</Title>
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label>Item Title*</Label>
          <Input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            placeholder="Enter item title"
          />
        </FormGroup>

        <FormGroup>
          <Label>Description*</Label>
          <TextArea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            placeholder="Describe your item in detail"
          />
        </FormGroup>

        <PriceContainer>
          <FormGroup>
            <Label>Starting Price (₹)*</Label>
            <Input
              type="number"
              name="startingPrice"
              value={formData.startingPrice}
              onChange={handleChange}
              required
              placeholder="Enter starting price"
            />
          </FormGroup>

          <FormGroup>
            <Label>Reserve Price (₹)</Label>
            <Input
              type="number"
              name="reservePrice"
              value={formData.reservePrice}
              onChange={handleChange}
              placeholder="Enter reserve price"
            />
          </FormGroup>
        </PriceContainer>

        <DateContainer>
          <FormGroup>
            <Label>Start Date*</Label>
            <Input
              type="datetime-local"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              required
            />
          </FormGroup>

          <FormGroup>
            <Label>End Date*</Label>
            <Input
              type="datetime-local"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              required
            />
          </FormGroup>
        </DateContainer>

        <FormGroup>
          <Label>Category*</Label>
          <Select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            <option value="">Select a category</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </Select>
        </FormGroup>

        <FormGroup>
          <Label>Item Condition*</Label>
          <Select
            name="itemCondition"
            value={formData.itemCondition}
            onChange={handleChange}
            required
          >
            <option value="">Select condition</option>
            {conditions.map(condition => (
              <option key={condition} value={condition}>{condition}</option>
            ))}
          </Select>
        </FormGroup>

        <FormGroup>
          <Label>Images*</Label>
          <ImageUploadInput
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageUpload}
            required
          />
          <ImageHelp>Upload up to 5 images (Max 5MB each)</ImageHelp>
        </FormGroup>

        <FormGroup>
          <Label>Location*</Label>
          <Input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
            placeholder="Enter item location"
          />
        </FormGroup>

        <SubmitButton type="submit">Create Auction</SubmitButton>
      </Form>
    </Container>
  );
}

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
`;

const Title = styled.h1`
  text-align: center;
  color: #333;
  margin-bottom: 30px;
`;

const Form = styled.form`
  background: white;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  color: #333;
  font-weight: 500;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;

  &:focus {
    outline: none;
    border-color: #4a90e2;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  height: 100px;
  resize: vertical;
  font-size: 16px;

  &:focus {
    outline: none;
    border-color: #4a90e2;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;

  &:focus {
    outline: none;
    border-color: #4a90e2;
  }
`;

const PriceContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
`;

const DateContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
`;

const ImageUploadInput = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

const ImageHelp = styled.p`
  font-size: 14px;
  color: #666;
  margin-top: 5px;
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 12px;
  background-color: #4a90e2;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #357abd;
  }
`;

export default PostAuction;