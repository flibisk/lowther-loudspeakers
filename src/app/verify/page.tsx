'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ScrollReveal } from '@/components/scroll-reveal';
import { LowtherForLifeSection } from '@/components/lowther-for-life-section';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { Search, Shield, Wallet } from 'lucide-react';

// NFT Collection Configuration
const NFT_COLLECTIONS = [
  {
    name: 'Series 1',
    contractAddress: '0xc5da9248d603ec02a9eabaf5bd833a670cd8056d',
    openseaSlug: 'lowther-loudspeakers-series-1',
  },
  // Future series can be added here:
  // {
  //   name: 'Series 2',
  //   contractAddress: '0x...',
  //   openseaSlug: 'lowther-loudspeakers-series-2',
  // },
];

export default function VerifyPage() {
  const [activeTab, setActiveTab] = useState<'register' | 'nft'>('register');
  const [selectedSeries, setSelectedSeries] = useState(NFT_COLLECTIONS[0]);
  const [registerFormData, setRegisterFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    product: '',
    serialNumber: '',
  });
  const [searchSerial, setSearchSerial] = useState('');
  const [isRegisterSubmitted, setIsRegisterSubmitted] = useState(false);
  const [nftData, setNftData] = useState<any>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState('');
  
  // Transfer request modal state
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [transferFormData, setTransferFormData] = useState({
    serialNumber: '',
    name: '',
    email: '',
    walletAddress: '',
    speakerImage: null as File | null,
  });
  const [isTransferSubmitted, setIsTransferSubmitted] = useState(false);
  
  // TODO: Implement thirdweb wallet connection
  const [isWalletConnected, setIsWalletConnected] = useState(false);

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement secure database storage (Beehiiv + custom DB)
    console.log('Drive unit registration:', registerFormData);
    setIsRegisterSubmitted(true);
  };

  const handleRegisterInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRegisterFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSerialSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    setSearchError('');
    setNftData(null);

    try {
      // Import ethers dynamically
      const { ethers } = await import('ethers');
      
      // Standard ERC721 ABI for the functions we need
      const erc721ABI = [
        'function totalSupply() view returns (uint256)',
        'function tokenByIndex(uint256 index) view returns (uint256)',
        'function tokenURI(uint256 tokenId) view returns (string)',
        'function ownerOf(uint256 tokenId) view returns (address)',
      ];

      // Connect to Ethereum mainnet via public RPC
      const rpcUrl = process.env.NEXT_PUBLIC_RPC_URL || 'https://eth.llamarpc.com';
      console.log('Using RPC URL:', rpcUrl);
      const provider = new ethers.JsonRpcProvider(rpcUrl);

      // Create contract instance
      const contract = new ethers.Contract(
        selectedSeries.contractAddress,
        erc721ABI,
        provider
      );

      console.log('Reading from contract:', selectedSeries.contractAddress);

      let foundNFT = null;
      let tokenIds: number[] = [];

      // Try method 1: ERC721Enumerable (if contract supports it)
      try {
        const totalSupply = await contract.totalSupply();
        const total = Number(totalSupply);
        console.log('Total NFTs in collection:', total);

        // Get all token IDs via enumeration
        for (let i = 0; i < total; i++) {
          try {
            const tokenId = await contract.tokenByIndex(i);
            tokenIds.push(Number(tokenId));
          } catch (err) {
            console.error(`Error getting token at index ${i}:`, err);
          }
        }
      } catch (enumerableError) {
        // If enumeration fails, try sequential token IDs (0 to 99 to cover various numbering schemes)
        console.log('Contract does not support enumeration, trying sequential IDs...');
        // Try IDs from 0 to 99 (covering both 0-indexed and 1-indexed systems)
        tokenIds = Array.from({ length: 100 }, (_, i) => i);
      }

      console.log('Token IDs to check:', tokenIds);

      // Search through tokens
      for (const tokenId of tokenIds) {
        try {
          console.log(`Checking token ${tokenId}...`);

          // Get token URI (metadata location) - this will fail if token doesn't exist
          let tokenURI;
          try {
            tokenURI = await contract.tokenURI(tokenId);
            console.log(`Token ${tokenId} URI:`, tokenURI);
          } catch (uriError: any) {
            // Token doesn't exist or URI call failed
            console.log(`Token ${tokenId} does not exist:`, uriError?.message || 'URI call failed');
            continue;
          }

          // Fetch metadata from IPFS or server
          let metadataUrl = tokenURI;
          if (tokenURI.startsWith('ipfs://')) {
            metadataUrl = tokenURI.replace('ipfs://', 'https://ipfs.io/ipfs/');
          } else if (tokenURI.startsWith('ar://')) {
            metadataUrl = tokenURI.replace('ar://', 'https://arweave.net/');
          }

          console.log(`Fetching metadata from: ${metadataUrl}`);
          const metadataResponse = await fetch(metadataUrl);
          
          if (!metadataResponse.ok) {
            console.error(`Failed to fetch metadata for token ${tokenId}`);
            continue;
          }

          const metadata = await metadataResponse.json();
          console.log(`Token ${tokenId} metadata:`, metadata);

          // Check if this token has the matching serial number
          const serialTrait = metadata.attributes?.find(
            (attr: any) => attr.trait_type === 'Serial Number'
          );

          console.log(`Token ${tokenId} serial:`, serialTrait?.value);

          if (serialTrait) {
            const nftSerial = serialTrait.value?.toString().trim();
            const searchSerialTrimmed = searchSerial.toString().trim();
            
            // Normalize serial numbers by removing leading zeros for comparison
            const normalizeSerial = (serial: string) => {
              // If it's a pure number, convert to number and back to remove leading zeros
              const num = parseInt(serial, 10);
              return isNaN(num) ? serial : num.toString();
            };
            
            const normalizedNftSerial = normalizeSerial(nftSerial);
            const normalizedSearchSerial = normalizeSerial(searchSerialTrimmed);
            
            // Try multiple matching strategies:
            // 1. Exact match (case-sensitive)
            // 2. Normalized numeric match (removes leading zeros like "00011" → "11")
            const isMatch = 
              nftSerial === searchSerialTrimmed || 
              normalizedNftSerial === normalizedSearchSerial;
            
            console.log(`Comparing: NFT="${nftSerial}" (normalized: "${normalizedNftSerial}") vs Search="${searchSerialTrimmed}" (normalized: "${normalizedSearchSerial}") → Match: ${isMatch}`);

            if (isMatch) {
              console.log('✅ Found matching NFT!', tokenId);
              
              // Format data to match our display component
              foundNFT = {
                identifier: tokenId.toString(),
                name: metadata.name,
                description: metadata.description,
                image_url: metadata.image?.startsWith('ipfs://') 
                  ? metadata.image.replace('ipfs://', 'https://ipfs.io/ipfs/')
                  : metadata.image?.startsWith('ar://')
                  ? metadata.image.replace('ar://', 'https://arweave.net/')
                  : metadata.image,
                display_image_url: metadata.image?.startsWith('ipfs://')
                  ? metadata.image.replace('ipfs://', 'https://ipfs.io/ipfs/')
                  : metadata.image?.startsWith('ar://')
                  ? metadata.image.replace('ar://', 'https://arweave.net/')
                  : metadata.image,
                traits: metadata.attributes?.map((attr: any) => ({
                  trait_type: attr.trait_type,
                  value: attr.value,
                })),
                contract: selectedSeries.contractAddress,
              };
              break;
            }
          }
        } catch (tokenError) {
          console.error(`Error reading token ${tokenId}:`, tokenError);
          continue;
        }
      }

      if (foundNFT) {
        setNftData(foundNFT);
      } else {
        setSearchError(`No NFT found with serial number "${searchSerial}" in ${selectedSeries.name}. Please check the serial number and try again.`);
      }
    } catch (error) {
      console.error('Error fetching NFT from blockchain:', error);
      setSearchError('Unable to fetch NFT data from blockchain. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleConnectWallet = () => {
    // TODO: Implement thirdweb wallet connection
    console.log('Connect wallet clicked');
    setIsWalletConnected(true);
  };

  const handleRequestTransfer = (serialNumber: string) => {
    setTransferFormData({
      serialNumber,
      name: '',
      email: '',
      walletAddress: '',
      speakerImage: null,
    });
    setIsTransferSubmitted(false);
    setIsTransferModalOpen(true);
  };

  const handleTransferInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTransferFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setTransferFormData(prev => ({ ...prev, speakerImage: file }));
    }
  };

  const handleTransferSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement transfer request submission (send to backend/email)
    console.log('Transfer request:', transferFormData);
    setIsTransferSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Sentinel for Nav */}
      <div id="hero-sentinel" className="absolute top-0 left-0 w-full h-16" />

      {/* Hero Banner */}
      <section data-surface="dark" className="relative min-h-[100vh] overflow-hidden">
        <Image
          src="/images/authenticity-checker/hero/Authenticity-checker-website.jpg"
          alt="Register or Find Your Speaker"
          fill
          className="absolute inset-0 h-full w-full object-cover"
          priority
          quality={100}
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
        
        <div className="absolute bottom-20 930:bottom-20 left-6 930:left-16 z-10 text-white max-w-xs sm:max-w-md 930:max-w-3xl">
          <div className="flex items-center mb-2">
            <div className="w-8 h-px bg-white mr-3"></div>
            <span className="text-sm tracking-wider uppercase text-white/80">AUTHENTICITY</span>
          </div>
          
          <h1 className="font-display text-4xl md:text-6xl font-bold leading-tight mb-4" style={{ color: '#c59862' }}>
            Register or Find Your Speaker
          </h1>
          
          <p className="hidden 930:block text-xl leading-relaxed">
            Lowther ownership is a guarantee, a community, a legacy to pass on and a love for music. Every speaker made officially by Lowther enjoys a 10 year warranty and access to Lowther for Life exclusives.
          </p>
        </div>
      </section>

      <Breadcrumbs 
        items={[
          { label: 'Home', href: '/' },
          { label: 'Authenticity Checker' }
        ]} 
      />

      {/* Tab Navigation */}
      <section data-surface="light" className="py-12 bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 sm:px-8">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => setActiveTab('register')}
              className={`flex items-center justify-center px-8 py-4 rounded-sm transition-all ${
                activeTab === 'register'
                  ? 'bg-[#c59862] text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Shield className="w-5 h-5 mr-2" />
              <span className="font-display text-lg">Register Your Drive Unit</span>
            </button>
            <button
              onClick={() => setActiveTab('nft')}
              className={`flex items-center justify-center px-8 py-4 rounded-sm transition-all ${
                activeTab === 'nft'
                  ? 'bg-[#c59862] text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Wallet className="w-5 h-5 mr-2" />
              <span className="font-display text-lg">View Your Digital Twin</span>
            </button>
          </div>
        </div>
      </section>

      {/* Register Drive Unit Section */}
      {activeTab === 'register' && (
        <section data-surface="light" className="py-24 bg-white">
          <div className="max-w-3xl mx-auto px-6 sm:px-8">
            <ScrollReveal animation="fade-up">
              <div className="text-center mb-12">
                <h2 className="font-display text-4xl mb-4" style={{ color: '#c59862' }}>
                  Register Your Drive Unit
                </h2>
                <p className="text-gray-700 leading-relaxed max-w-2xl mx-auto">
                  Register your Lowther drive unit to activate your warranty and gain access to exclusive Lowther for Life benefits.
                </p>
              </div>

              {!isRegisterSubmitted ? (
                <form onSubmit={handleRegisterSubmit} className="space-y-6 bg-[#fafaf8] p-8 rounded-sm shadow-sm">
                  {/* Name */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={registerFormData.name}
                      onChange={handleRegisterInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#c59862] focus:border-transparent"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={registerFormData.email}
                      onChange={handleRegisterInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#c59862] focus:border-transparent"
                    />
                  </div>

                  {/* Phone Number */}
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      required
                      value={registerFormData.phone}
                      onChange={handleRegisterInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#c59862] focus:border-transparent"
                    />
                  </div>

                  {/* Location */}
                  <div>
                    <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                      Location *
                    </label>
                    <input
                      type="text"
                      id="location"
                      name="location"
                      required
                      value={registerFormData.location}
                      onChange={handleRegisterInputChange}
                      placeholder="City, Country"
                      className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#c59862] focus:border-transparent"
                    />
                  </div>

                  {/* Product */}
                  <div>
                    <label htmlFor="product" className="block text-sm font-medium text-gray-700 mb-2">
                      Product *
                    </label>
                    <input
                      type="text"
                      id="product"
                      name="product"
                      required
                      value={registerFormData.product}
                      onChange={handleRegisterInputChange}
                      placeholder="e.g. DX3, PX4 Amplifier, PM6C"
                      className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#c59862] focus:border-transparent"
                    />
                  </div>

                  {/* Serial Number */}
                  <div>
                    <label htmlFor="serialNumber" className="block text-sm font-medium text-gray-700 mb-2">
                      Serial Number *
                    </label>
                    <input
                      type="text"
                      id="serialNumber"
                      name="serialNumber"
                      required
                      value={registerFormData.serialNumber}
                      onChange={handleRegisterInputChange}
                      placeholder="Enter your drive unit serial number"
                      className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#c59862] focus:border-transparent font-mono"
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="pt-4">
                    <Button 
                      type="submit" 
                      size="lg" 
                      className="w-full bg-black hover:bg-[#c59862] text-white font-sarabun text-xs tracking-[3px] transition-all duration-300 uppercase"
                    >
                      Register Drive Unit
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="text-center py-12 bg-[#fafaf8] rounded-sm shadow-sm">
                  <div className="w-20 h-20 bg-[#c59862]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-10 h-10" style={{ color: '#c59862' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  
                  <h3 className="font-display text-3xl mb-4" style={{ color: '#c59862' }}>
                    Registration Complete
                  </h3>
                  
                  <p className="text-lg text-gray-700 max-w-xl mx-auto mb-4">
                    Your drive unit has been successfully registered. Your warranty is now active and you have access to Lowther for Life exclusives.
                  </p>
                  
                  <p className="text-sm text-gray-600 mb-8">
                    Serial Number: <span className="font-mono font-semibold">{registerFormData.serialNumber}</span>
                  </p>

                  <Button 
                    onClick={() => {
                      setIsRegisterSubmitted(false);
                      setRegisterFormData({ name: '', email: '', phone: '', location: '', product: '', serialNumber: '' });
                    }}
                    variant="outline"
                    className="border-[#c59862] text-[#c59862] hover:bg-[#c59862] hover:text-white"
                  >
                    Register Another Drive Unit
                  </Button>
                </div>
              )}
            </ScrollReveal>
          </div>
        </section>
      )}

      {/* NFT Digital Twin Section */}
      {activeTab === 'nft' && (
        <section data-surface="light" className="py-24 bg-white">
          <div className="max-w-4xl mx-auto px-6 sm:px-8">
            <ScrollReveal animation="fade-up">
              <div className="text-center mb-12">
                <h2 className="font-display text-4xl mb-4" style={{ color: '#c59862' }}>
                  View your speakers digital twin
                </h2>
                <p className="text-gray-700 leading-relaxed max-w-2xl mx-auto mb-6">
                  Every Lowther cabinet has a digital twin NFT on the blockchain. Search by serial number or connect your wallet to view your collection.
                </p>
                
                {/* Series Selector */}
                {NFT_COLLECTIONS.length > 1 && (
                  <div className="flex gap-2 justify-center mb-4">
                    {NFT_COLLECTIONS.map((collection) => (
                      <button
                        key={collection.contractAddress}
                        onClick={() => {
                          setSelectedSeries(collection);
                          setNftData(null);
                          setSearchError('');
                        }}
                        className={`px-4 py-2 rounded-sm text-sm font-medium transition-all ${
                          selectedSeries.contractAddress === collection.contractAddress
                            ? 'bg-[#c59862] text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {collection.name}
                      </button>
                    ))}
                  </div>
                )}
                
                <a 
                  href={`https://opensea.io/collection/${selectedSeries.openseaSlug}`}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-[#c59862] hover:underline text-sm"
                >
                  View {selectedSeries.name} on OpenSea →
                </a>
              </div>

              {/* Search by Serial Number */}
              <div className="mb-12 bg-[#fafaf8] p-8 rounded-sm shadow-sm">
                <h3 className="font-display text-2xl mb-4" style={{ color: '#c59862' }}>
                  Search by Serial Number
                </h3>
                <p className="text-gray-700 mb-6">
                  Enter your cabinet's serial number to find its digital twin NFT.
                </p>
                <form onSubmit={handleSerialSearch} className="flex flex-col sm:flex-row gap-4">
                  <input
                    type="text"
                    value={searchSerial}
                    onChange={(e) => setSearchSerial(e.target.value)}
                    placeholder="Enter serial number"
                    className="flex-1 px-4 py-3 h-12 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#c59862] focus:border-transparent font-mono"
                    required
                  />
                  <Button 
                    type="submit"
                    disabled={isSearching}
                    className="w-full sm:w-auto h-12 bg-black hover:bg-[#c59862] text-white font-sarabun text-xs tracking-[3px] transition-all duration-300 uppercase whitespace-nowrap disabled:opacity-50"
                  >
                    <Search className="w-4 h-4 mr-2" />
                    {isSearching ? 'Searching...' : 'Search NFT'}
                  </Button>
                </form>
              </div>

              {/* Loading Animation */}
              {isSearching && (
                <div className="mb-12 flex flex-col items-center justify-center py-12">
                  <div className="relative w-16 h-16 mb-4">
                    <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-[#c59862] rounded-full border-t-transparent animate-spin"></div>
                  </div>
                  <p className="text-gray-600 text-lg">Searching the blockchain...</p>
                  <p className="text-gray-500 text-sm mt-2">This may take a few moments</p>
                </div>
              )}

              {/* Error Message */}
              {searchError && !isSearching && (
                <div className="mb-12 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-sm">
                  {searchError}
                </div>
              )}

              {/* NFT Display Card (in white space below search box) */}
              {nftData && !isSearching && (
                <div className="mb-12 bg-white border border-gray-200 rounded-sm overflow-hidden shadow-lg max-w-2xl mx-auto">
                  {/* NFT Image on top */}
                  <div className="relative aspect-square bg-gray-100">
                    <img
                      src={nftData.image_url || nftData.display_image_url}
                      alt={nftData.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* NFT Details below */}
                  <div className="p-8">
                    <div className="mb-6">
                      <h4 className="font-display text-3xl mb-2" style={{ color: '#c59862' }}>
                        {nftData.name}
                      </h4>
                      <p className="text-base text-gray-600">
                        {nftData.description || 'Lowther Loudspeakers: Series 1'}
                      </p>
                    </div>

                    {/* Traits */}
                    <div className="mb-6">
                      <h5 className="font-display text-xl mb-4 text-gray-900">Traits</h5>
                      <div className="grid grid-cols-2 gap-4">
                        {nftData.traits?.map((trait: any, index: number) => (
                          <div key={index} className="bg-gray-50 p-4 rounded-sm">
                            <p className="text-xs text-gray-600 uppercase tracking-wide mb-1">
                              {trait.trait_type}
                            </p>
                            <p className="text-base font-medium text-gray-900 break-words">
                              {trait.value}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Blockchain Details */}
                    <div className="border-t border-gray-200 pt-6">
                      <h5 className="font-display text-xl mb-4 text-gray-900">Blockchain Details</h5>
                      <div className="space-y-3 text-base">
                        <div>
                          <span className="text-gray-600">Token ID:</span>
                          <span className="ml-2 font-mono text-gray-900">{nftData.identifier}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Contract:</span>
                          <span className="ml-2 font-mono text-sm text-gray-900 break-all">
                            {nftData.contract}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600">Standard:</span>
                          <span className="ml-2 text-gray-900">ERC-721</span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="mt-6 flex flex-col sm:flex-row gap-3">
                        <a
                          href={`https://opensea.io/assets/ethereum/${nftData.contract}/${nftData.identifier}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full sm:flex-1"
                        >
                          <Button
                            size="lg"
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                          >
                            View on OpenSea →
                          </Button>
                        </a>
                        <Button
                          size="lg"
                          onClick={() => {
                            const serialTrait = nftData.traits?.find((t: any) => t.trait_type === 'Serial Number');
                            handleRequestTransfer(serialTrait?.value || nftData.identifier);
                          }}
                          className="w-full sm:flex-1 bg-[#c59862] hover:bg-[#b08552] text-white"
                        >
                          Request Transfer
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </ScrollReveal>

            <ScrollReveal animation="fade-up">
              {/* Connect Wallet Section */}
              <div className="bg-[#fafaf8] p-8 rounded-sm shadow-sm">
                <h3 className="font-display text-2xl mb-4" style={{ color: '#c59862' }}>
                  View Your Lowther NFTs
                </h3>
                <p className="text-gray-700 mb-6">
                  Connect your wallet to view all Lowther NFTs you own.
                </p>
                
                {!isWalletConnected ? (
                  <div className="text-center py-8">
                    <Button 
                      onClick={handleConnectWallet}
                      size="lg"
                      className="bg-black hover:bg-[#c59862] text-white font-sarabun text-xs tracking-[3px] transition-all duration-300 uppercase"
                    >
                      <Wallet className="w-5 h-5 mr-2" />
                      Connect Wallet
                    </Button>
                    <p className="text-sm text-gray-600 mt-4">
                      We support MetaMask, WalletConnect, and more
                    </p>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="bg-green-50 border border-green-200 rounded-sm p-4 mb-6">
                      <p className="text-green-800">✓ Wallet Connected</p>
                      <p className="text-sm text-green-700 mt-1">0x1234...5678</p>
                    </div>
                    <p className="text-gray-700 mb-4">Your Lowther NFTs will appear here</p>
                    {/* TODO: Display user's NFTs from thirdweb */}
                  </div>
                )}
              </div>

            </ScrollReveal>
          </div>
        </section>
      )}

      {/* Lowther for Life Video Section */}
      <LowtherForLifeSection backgroundColor="bg-[#fafaf8]" />

      {/* Transfer Request Modal */}
      {isTransferModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4">
            {/* Backdrop */}
            <div 
              className="fixed inset-0 bg-black/50 transition-opacity"
              onClick={() => !isTransferSubmitted && setIsTransferModalOpen(false)}
            />
            
            {/* Modal Content */}
            <div className="relative bg-white rounded-sm shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              {!isTransferSubmitted ? (
                <div className="p-8">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-display text-3xl" style={{ color: '#c59862' }}>
                      Request NFT Transfer
                    </h3>
                    <button
                      onClick={() => setIsTransferModalOpen(false)}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  {/* Info Banner */}
                  <div className="bg-blue-50 border border-blue-200 rounded-sm p-4 mb-6">
                    <p className="text-blue-900 text-sm leading-relaxed">
                      <strong>Manual Review Process:</strong> All transfer requests are manually reviewed by Lowther staff to ensure authenticity. 
                      Please allow 3-5 business days for verification and transfer approval. You will receive an email confirmation once your request is processed.
                    </p>
                  </div>

                  {/* Transfer Form */}
                  <form onSubmit={handleTransferSubmit} className="space-y-6">
                    {/* Serial Number (auto-populated, readonly) */}
                    <div>
                      <label htmlFor="serialNumber" className="block text-sm font-medium text-gray-700 mb-2">
                        Serial Number
                      </label>
                      <input
                        type="text"
                        id="serialNumber"
                        name="serialNumber"
                        value={transferFormData.serialNumber}
                        readOnly
                        className="w-full px-4 py-3 border border-gray-300 rounded-sm bg-gray-50 font-mono text-gray-600 cursor-not-allowed"
                      />
                    </div>

                    {/* Name */}
                    <div>
                      <label htmlFor="transfer-name" className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="transfer-name"
                        name="name"
                        value={transferFormData.name}
                        onChange={handleTransferInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#c59862] focus:border-transparent"
                        required
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label htmlFor="transfer-email" className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        id="transfer-email"
                        name="email"
                        value={transferFormData.email}
                        onChange={handleTransferInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#c59862] focus:border-transparent"
                        required
                      />
                    </div>

                    {/* Wallet Address */}
                    <div>
                      <label htmlFor="walletAddress" className="block text-sm font-medium text-gray-700 mb-2">
                        Wallet Address (Ethereum) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="walletAddress"
                        name="walletAddress"
                        value={transferFormData.walletAddress}
                        onChange={handleTransferInputChange}
                        placeholder="0x..."
                        className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#c59862] focus:border-transparent font-mono text-sm"
                        required
                        pattern="^0x[a-fA-F0-9]{40}$"
                        title="Please enter a valid Ethereum wallet address (0x...)"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        The NFT will be transferred to this Ethereum wallet address
                      </p>
                    </div>

                    {/* Speaker Image Upload */}
                    <div>
                      <label htmlFor="speakerImage" className="block text-sm font-medium text-gray-700 mb-2">
                        Photo of Your Speaker <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="file"
                        id="speakerImage"
                        name="speakerImage"
                        onChange={handleImageUpload}
                        accept="image/*"
                        className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#c59862] focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-sm file:border-0 file:text-sm file:font-semibold file:bg-[#c59862] file:text-white hover:file:bg-[#b08552] file:cursor-pointer"
                        required
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Please upload a clear photo showing your Lowther speaker with the serial plate visible
                      </p>
                      {transferFormData.speakerImage && (
                        <p className="text-sm text-green-600 mt-2">
                          ✓ File selected: {transferFormData.speakerImage.name}
                        </p>
                      )}
                    </div>

                    {/* Submit Button */}
                    <div className="pt-4 flex gap-3">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsTransferModalOpen(false)}
                        className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
                      >
                        Cancel
                      </Button>
                      <Button 
                        type="submit" 
                        className="flex-1 bg-[#c59862] hover:bg-[#b08552] text-white font-sarabun text-xs tracking-[3px] transition-all duration-300 uppercase"
                      >
                        Submit Request
                      </Button>
                    </div>
                  </form>
                </div>
              ) : (
                // Success Message
                <div className="p-8 text-center">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  
                  <h3 className="font-display text-3xl mb-4" style={{ color: '#c59862' }}>
                    Request Submitted
                  </h3>
                  
                  <p className="text-lg text-gray-700 max-w-xl mx-auto mb-4">
                    Your transfer request has been successfully submitted. Our team will review your request and contact you within 3-5 business days.
                  </p>
                  
                  <p className="text-sm text-gray-600 mb-8">
                    Reference: <span className="font-mono font-semibold">{transferFormData.serialNumber}</span>
                  </p>

                  <Button 
                    onClick={() => {
                      setIsTransferModalOpen(false);
                      setIsTransferSubmitted(false);
                    }}
                    className="bg-[#c59862] hover:bg-[#b08552] text-white"
                  >
                    Close
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

