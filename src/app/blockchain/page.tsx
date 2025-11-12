'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import RegisterLand from '@/components/blockchain/RegisterLand';
import LandsList from '@/components/blockchain/LandsList';
import { useWeb3 } from '@/context/Web3Context';
import { Button } from '@/components/ui/button';

export default function BlockchainPage() {
  const { isConnected, account, connectWallet } = useWeb3();

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Land Registry on Blockchain</h1>
        {!isConnected ? (
          <Button onClick={connectWallet}>Connect Wallet</Button>
        ) : (
          <div className="flex items-center space-x-2">
            <span className="text-sm bg-muted px-3 py-1 rounded-full">
              {`${account?.substring(0, 6)}...${account?.substring(account.length - 4)}`}
            </span>
          </div>
        )}
      </div>

      <Tabs defaultValue="register" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-md mb-8">
          <TabsTrigger value="register">Register Land</TabsTrigger>
          <TabsTrigger value="explore">Explore Lands</TabsTrigger>
        </TabsList>
        
        <TabsContent value="register">
          <RegisterLand />
        </TabsContent>
        
        <TabsContent value="explore">
          <LandsList />
        </TabsContent>
      </Tabs>
    </div>
  );
}
