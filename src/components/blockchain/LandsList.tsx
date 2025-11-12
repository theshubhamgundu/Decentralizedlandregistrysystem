import { useEffect, useState } from 'react';
import { useWeb3 } from '@/context/Web3Context';
import { ethers } from 'ethers';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Loader2 } from 'lucide-react';

type Land = {
  location: string;
  ownerName: string;
  area: string;
  price: string;
  isForSale: boolean;
  currentOwner: string;
};

export default function LandsList() {
  const { contract, account, isConnected, connectWallet } = useWeb3();
  const [lands, setLands] = useState<{id: number, land: Land}[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [buyingLand, setBuyingLand] = useState<number | null>(null);
  const [newOwnerName, setNewOwnerName] = useState('');
  const [showBuyForm, setShowBuyForm] = useState<number | null>(null);

  const fetchLands = async () => {
    if (!contract) return;
    
    try {
      setRefreshing(true);
      setError('');
      
      // Get land count
      const landCount = await contract.landCount();
      
      // Fetch all lands
      const landsData = [];
      for (let i = 1; i <= landCount; i++) {
        const landData = await contract.lands(i);
        landsData.push({
          id: i,
          land: {
            location: landData[0],
            ownerName: landData[1],
            area: ethers.utils.formatEther(landData[2]),
            price: ethers.utils.formatEther(landData[3]),
            isForSale: landData[4],
            currentOwner: landData[5],
          },
        });
      }
      
      setLands(landsData);
    } catch (err: any) {
      console.error('Error fetching lands:', err);
      setError('Failed to fetch lands. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const toggleForSale = async (landId: number, currentStatus: boolean) => {
    if (!contract || !account) return;
    
    try {
      setLoading(true);
      setError('');
      
      // Get current price or prompt for new price
      const newPrice = prompt('Enter new price in ETH:', '1.0');
      if (!newPrice) return;
      
      const tx = await contract.toggleForSale(landId, ethers.utils.parseEther(newPrice));
      await tx.wait();
      
      // Refresh lands
      await fetchLands();
      alert(`Land ${currentStatus ? 'removed from' : 'listed for'} sale successfully!`);
    } catch (err: any) {
      console.error('Error toggling land sale status:', err);
      setError(err.message || 'Failed to update land status');
    } finally {
      setLoading(false);
    }
  };

  const buyLand = async (landId: number) => {
    if (!contract || !account || !newOwnerName) return;
    
    try {
      setBuyingLand(landId);
      setError('');
      
      const land = lands.find(l => l.id === landId)?.land;
      if (!land) throw new Error('Land not found');
      
      const tx = await contract.buyLand(landId, newOwnerName, {
        value: ethers.utils.parseEther(land.price)
      });
      
      await tx.wait();
      
      // Reset form and refresh
      setNewOwnerName('');
      setShowBuyForm(null);
      await fetchLands();
      
      alert('Land purchased successfully!');
    } catch (err: any) {
      console.error('Error buying land:', err);
      setError(err.message || 'Failed to buy land');
    } finally {
      setBuyingLand(null);
    }
  };

  useEffect(() => {
    if (isConnected && contract) {
      fetchLands();
    }
  }, [isConnected, contract]);

  if (!isConnected) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Land Registry</CardTitle>
          <CardDescription>
            Connect your wallet to view and manage land properties
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center py-8">
          <Button onClick={connectWallet} size="lg">
            Connect Wallet
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (loading && !refreshing) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading lands...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Land Registry</h2>
        <Button 
          onClick={fetchLands} 
          variant="outline" 
          disabled={refreshing}
        >
          {refreshing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Refreshing...
            </>
          ) : (
            'Refresh'
          )}
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      {lands.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          No lands registered yet. Register a new land to get started.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {lands.map(({ id, land }) => (
            <Card key={id} className="flex flex-col h-full">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{land.location}</CardTitle>
                    <CardDescription className="mt-1">
                      ID: {id}
                    </CardDescription>
                  </div>
                  <Badge variant={land.isForSale ? 'default' : 'secondary'}>
                    {land.isForSale ? 'For Sale' : 'Not for Sale'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="space-y-2">
                  <div>
                    <span className="font-medium">Owner:</span> {land.ownerName}
                  </div>
                  <div>
                    <span className="font-medium">Area:</span> {land.area} sqm
                  </div>
                  <div>
                    <span className="font-medium">Price:</span> {land.price} ETH
                  </div>
                  <div className="text-sm text-gray-500 break-all">
                    {land.currentOwner}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-2">
                {land.currentOwner.toLowerCase() === account?.toLowerCase() ? (
                  <Button 
                    variant={land.isForSale ? 'outline' : 'default'}
                    className="w-full"
                    onClick={() => toggleForSale(id, land.isForSale)}
                    disabled={loading}
                  >
                    {land.isForSale ? 'Remove from Sale' : 'Put on Sale'}
                  </Button>
                ) : land.isForSale ? (
                  <div className="w-full space-y-2">
                    {showBuyForm === id ? (
                      <div className="space-y-2">
                        <input
                          type="text"
                          value={newOwnerName}
                          onChange={(e) => setNewOwnerName(e.target.value)}
                          placeholder="Your name"
                          className="w-full px-3 py-2 border rounded-md"
                          required
                        />
                        <div className="flex space-x-2">
                          <Button 
                            onClick={() => buyLand(id)}
                            className="flex-1"
                            disabled={!newOwnerName || buyingLand === id}
                          >
                            {buyingLand === id ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Processing...
                              </>
                            ) : (
                              `Buy for ${land.price} ETH`
                            )}
                          </Button>
                          <Button 
                            variant="outline" 
                            onClick={() => setShowBuyForm(null)}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <Button 
                        onClick={() => setShowBuyForm(id)}
                        className="w-full"
                      >
                        Buy Land
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="text-sm text-gray-500 text-center w-full">
                    Not available for purchase
                  </div>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
