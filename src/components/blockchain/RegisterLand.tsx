import { useState } from 'react';
import { useWeb3 } from '@/context/Web3Context';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Loader2 } from 'lucide-react';

export default function RegisterLand() {
  const { contract, isConnected, connectWallet } = useWeb3();
  const [location, setLocation] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [area, setArea] = useState('');
  const [price, setPrice] = useState('');
  const [loading, setLoading] = useState(false);
  const [txHash, setTxHash] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isConnected) {
      await connectWallet();
      return;
    }

    if (!location || !ownerName || !area || !price) {
      setError('Please fill in all fields');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      const tx = await contract.registerLand(
        location,
        ownerName,
        ethers.utils.parseEther(area),
        ethers.utils.parseEther(price)
      );
      
      setTxHash(tx.hash);
      await tx.wait();
      
      // Reset form
      setLocation('');
      setOwnerName('');
      setArea('');
      setPrice('');
      
      alert('Land registered successfully!');
    } catch (err: any) {
      console.error('Error registering land:', err);
      setError(err.message || 'Failed to register land');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Register New Land</CardTitle>
        <CardDescription>
          Register a new land property on the blockchain
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="123 Main St, City, Country"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="ownerName">Owner Name</Label>
            <Input
              id="ownerName"
              value={ownerName}
              onChange={(e) => setOwnerName(e.target.value)}
              placeholder="John Doe"
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="area">Area (sqm)</Label>
              <Input
                id="area"
                type="number"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                placeholder="1000"
                min="0"
                step="0.01"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="price">Price (ETH)</Label>
              <Input
                id="price"
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="1.5"
                min="0"
                step="0.000000000000000001"
                required
              />
            </div>
          </div>
          
          {error && (
            <div className="text-red-500 text-sm">
              {error}
            </div>
          )}
          
          {txHash && (
            <div className="text-sm text-green-600">
              Transaction sent!{' '}
              <a 
                href={`https://mumbai.polygonscan.com/tx/${txHash}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="underline"
              >
                View on Polygonscan
              </a>
            </div>
          )}
          
          <Button 
            type="submit" 
            className="w-full"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : isConnected ? (
              'Register Land'
            ) : (
              'Connect Wallet to Register'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
