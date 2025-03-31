import { useNavigate } from 'react-router-dom';
import { 
  Container, 
  Card, 
  CardTitle, 
  CardContent, 
  Button 
} from '../components/styled/StyledComponents';
import '../styles/Shop.css';

const Shop = () => {
  const navigate = useNavigate();
  
  const products = [
    {
      id: 1,
      name: 'Pet Feeder Basic',
      price: 49.99,
      description: 'Our basic model with all essential features.',
      image: 'https://images.unsplash.com/photo-1601758125946-6ec2ef64daf8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80'
    },
    {
      id: 2,
      name: 'Pet Feeder Pro',
      price: 79.99,
      description: 'Advanced features with larger capacity and longer battery life.',
      image: 'https://images.unsplash.com/photo-1571566882372-1598d88abd90?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80'
    },
    {
      id: 3,
      name: 'Pet Feeder Premium',
      price: 129.99,
      description: 'Our premium model with camera, temperature control, and voice commands.',
      image: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80'
    },
    {
      id: 4,
      name: 'Extra Food Container',
      price: 19.99,
      description: 'Additional container for your Pet Feeder device.',
      image: 'https://images.unsplash.com/photo-1604542031658-5799ca5d7936?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80'
    }
  ];
  
  return (
    <Container>
      <div className="shop-container">
        <h1 className="shop-title">Shop</h1>
        
        <div className="products-grid">
          {products.map(product => (
            <Card key={product.id}>
              <img 
                src={product.image} 
                alt={product.name} 
                className="product-image"
              />
              <div className="product-details">
                <CardTitle className="product-title">{product.name}</CardTitle>
                <div className="product-price">
                  ${product.price.toFixed(2)}
                </div>
                <CardContent className="product-description">
                  {product.description}
                </CardContent>
                <Button primary block>Add to Cart</Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </Container>
  );
};

export default Shop; 