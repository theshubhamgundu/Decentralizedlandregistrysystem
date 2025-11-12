import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import { ethers } from 'ethers';
import { supabase } from '@/lib/supabase';

// Define contract ABI types
interface LandRegistryABI extends ethers.ContractInterface {
  landCount(): Promise<ethers.BigNumber>;
  lands(id: number): Promise<[number, string, string, ethers.BigNumber, ethers.BigNumber, boolean, string]>;
  registerLand(
    location: string,
    ownerName: string,
    area: ethers.BigNumberish,
    price: ethers.BigNumberish,
    options?: { gasLimit?: ethers.BigNumberish }
  ): Promise<ethers.ContractTransaction>;
  transferOwnership(
    landId: number,
    newOwner: string,
    newOwnerName: string,
    options?: { gasLimit?: ethers.BigNumberish }
  ): Promise<ethers.ContractTransaction>;
  toggleForSale(
    landId: number,
    price: ethers.BigNumberish,
    options?: { gasLimit?: ethers.BigNumberish }
  ): Promise<ethers.ContractTransaction>;
  buyLand(
    landId: number,
    buyer: string,
    options?: { value?: ethers.BigNumberish; gasLimit?: ethers.BigNumberish }
  ): Promise<ethers.ContractTransaction>;
}

// Define land type for the application
interface Land {
  id: string;
  location: string;
  owner_name: string;
  area: number;
  price: number;
  is_for_sale: boolean;
  current_owner_address: string;
  created_at: string;
  updated_at: string;
}

interface DatabaseLand {
  id: string;
  location: string;
  owner_name: string;
  area: number;
  price: number;
  is_for_sale: boolean;
  current_owner_address: string;
  created_at: string;
  updated_at: string;
}

type Web3ContextType = {
  provider: ethers.providers.Web3Provider | null;
  signer: ethers.Signer | null;
  contract: LandRegistry | null;
  account: string;
  connectWallet: () => Promise<void>;
  isConnected: boolean;
  chainId: number | null;
  lands: Land[];
  loading: boolean;
  refreshLands: () => Promise<void>;
  registerLand: (location: string, ownerName: string, area: string, price: string) => Promise<void>;
  transferLand: (landId: string, toAddress: string, newOwnerName: string) => Promise<void>;
  toggleForSale: (landId: string, price: string) => Promise<void>;
  buyLand: (landId: string) => Promise<void>;
};

const Web3Context = createContext<Web3ContextType>({
  provider: null,
  signer: null,
  contract: null,
  account: '',
  connectWallet: async () => {},
  isConnected: false,
  chainId: null,
  lands: [],
  loading: true,
  refreshLands: async () => {},
  registerLand: async () => {},
  transferLand: async () => {},
  toggleForSale: async () => {},
  buyLand: async () => {},
});

export function Web3Provider({ children }: { children: ReactNode }) {
  const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [contract, setContract] = useState<LandRegistry | null>(null);
  const [account, setAccount] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [chainId, setChainId] = useState<number | null>(null);
  const [lands, setLands] = useState<DatabaseLand[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch lands from Supabase
  const fetchLands = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('lands')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setLands(data || []);
    } catch (error) {
      console.error('Error fetching lands:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Subscribe to real-time updates
  useEffect(() => {
    const subscription = supabase
      .from('lands')
      .on('*', () => fetchLands())
      .subscribe();

    fetchLands(); // Initial fetch

    return () => {
      supabase.removeSubscription(subscription);
    };
  }, [fetchLands]);

  // Initialize provider when component mounts
  useEffect(() => {
    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      setProvider(provider);

      // Check if already connected
      const checkConnection = async () => {
        try {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          if (accounts.length > 0) {
            await setupWeb3(provider);
          }
        } catch (error) {
          console.error('Error checking connection:', error);
        }
      };

      checkConnection();

      // Listen for account changes
      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          setupWeb3(provider);
        } else {
          setAccount('');
          setIsConnected(false);
          setSigner(null);
          setContract(null);
        }
      });

      // Listen for chain changes
      window.ethereum.on('chainChanged', () => {
        window.location.reload();
      });
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeAllListeners('accountsChanged');
        window.ethereum.removeAllListeners('chainChanged');
      }
    };
  }, []);

  const setupWeb3 = async (web3Provider: ethers.providers.Web3Provider) => {
    if (!window.ethereum) {
      throw new Error('MetaMask not installed');
    }
    try {
      // Request account access if needed
      await web3Provider.send("eth_requestAccounts", []);

      // Get signer
      const signer = web3Provider.getSigner();
      setSigner(signer);

      // Get account
      const address = await signer.getAddress();
      setAccount(address);

      // Get chain ID
      const network = await web3Provider.getNetwork();
      setChainId(Number(network.chainId));

      // Initialize contract
      const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
      if (contractAddress) {
        const contract = new ethers.Contract(
          contractAddress,
          [
            'function landCount() view returns (uint256)',
            'function lands(uint256) view returns (uint256, string, string, uint256, uint256, bool, address)',
            'function registerLand(string, string, uint256, uint256) external',
            'function transferOwnership(uint256, address, string) external',
            'function toggleForSale(uint256, uint256) external',
            'function buyLand(uint256, address) external payable',
            'event LandRegistered(uint256 indexed landId, string location, string ownerName, uint256 area, uint256 price)',
            'event OwnershipTransferred(uint256 indexed landId, address indexed previousOwner, address indexed newOwner, string newOwnerName)',
            'event LandForSale(uint256 indexed landId, uint256 price)',
            'event LandSold(uint256 indexed landId, address indexed seller, address indexed buyer, uint256 price)'
          ],
          signer
        ) as unknown as LandRegistry;
        setContract(contract);
      }

      setIsConnected(true);
    } catch (error) {
      console.error('Error setting up Web3:', error);
      setIsConnected(false);
    }
  };

  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        await setupWeb3(provider);
      } catch (error) {
        console.error('Error connecting wallet:', error);
        alert('Failed to connect wallet. Please check the console for details.');
      }
    } else {
      alert('Please install MetaMask to use this application!');
      window.open('https://metamask.io/download.html', '_blank');
    }
  };

  // Register a new land
  const registerLand = async (location: string, ownerName: string, area: string, price: string) => {
    if (!contract || !account) throw new Error('Contract not connected');
    
    try {
      const tx = await contract.registerLand(
        location,
        ownerName,
        ethers.utils.parseEther(area),
        ethers.utils.parseEther(price),
        { gasLimit: 300000 }
      );
      
      const receipt = await tx.wait();
      
      // Get the land ID from the event
      const event = receipt.events?.find((e: ethers.Event) => e.event === 'LandRegistered');
      const landId = event?.args?.landId?.toString();
      
      if (!landId) throw new Error('Failed to get land ID from transaction');
      
      // Update Supabase
      const { error } = await supabase.from('lands').insert([
        {
          id: landId,
          location,
          owner_name: ownerName,
          area: parseFloat(area),
          price: parseFloat(price),
          current_owner_address: account,
          is_for_sale: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ]);

      if (error) throw error;
      
      await fetchLands();
    } catch (error) {
      console.error('Error registering land:', error);
      throw error;
    }
  };

  // Transfer land ownership
  const transferLand = async (landId: string, toAddress: string, newOwnerName: string) => {
    if (!contract) throw new Error('Contract not connected');
    
    try {
      const tx = await contract.transferOwnership(
        landId,
        toAddress,
        newOwnerName,
        { gasLimit: 300000 }
      );
      
      await tx.wait();
      
      // Update Supabase
      const { error } = await supabase
        .from('lands')
        .update({
          owner_name: newOwnerName,
          current_owner_address: toAddress,
          updated_at: new Date().toISOString()
        })
        .eq('id', landId);

      if (error) throw error;
      
      await fetchLands();
    } catch (error) {
      console.error('Error transferring land:', error);
      throw error;
    }
  };

  // Toggle land for sale
  const toggleForSale = async (landId: string, price: string) => {
    if (!contract) throw new Error('Contract not connected');
    
    try {
      const tx = await contract.toggleForSale(
        landId,
        ethers.utils.parseEther(price),
        { gasLimit: 300000 }
      );
      
      await tx.wait();
      
      // Get current sale status to toggle
      const { data: land } = await supabase
        .from('lands')
        .select('is_for_sale')
        .eq('id', landId)
        .single();
      
      const newSaleStatus = !land?.is_for_sale;
      
      // Update Supabase
      const { error } = await supabase
        .from('lands')
        .update({
          is_for_sale: newSaleStatus,
          price: parseFloat(price),
          updated_at: new Date().toISOString()
        })
        .eq('id', landId);

      if (error) throw error;
      
      await fetchLands();
    } catch (error) {
      console.error('Error toggling land for sale:', error);
      throw error;
    }
  };

  // Buy land
  const buyLand = async (landId: string) => {
    if (!contract || !account) throw new Error('Contract not connected');
    
    try {
      // Get land price
      const { data: land } = await supabase
        .from('lands')
        .select('price')
        .eq('id', landId)
        .single();
      
      if (!land) throw new Error('Land not found');
      
      const tx = await contract.buyLand(landId, account, {
        value: ethers.utils.parseEther(land.price.toString()),
        gasLimit: 300000
      });
      
      await tx.wait();
      
      // Update Supabase
      const { error } = await supabase
        .from('lands')
        .update({
          is_for_sale: false,
          current_owner_address: account,
          updated_at: new Date().toISOString()
        })
        .eq('id', landId);

      if (error) throw error;
      
      await fetchLands();
    } catch (error) {
      console.error('Error buying land:', error);
      throw error;
    }
  };

  return (
    <Web3Context.Provider
      value={{
        provider,
        signer,
        contract,
        account,
        connectWallet,
        isConnected,
        chainId,
        lands,
        loading,
        refreshLands: fetchLands,
        registerLand,
        transferLand,
        toggleForSale,
        buyLand,
      }}
    >
      {children}
    </Web3Context.Provider>
  );
}

export const useWeb3 = () => useContext(Web3Context);
