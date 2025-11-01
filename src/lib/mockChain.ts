// Mock blockchain data for Lowther serial verification
// This simulates on-chain records for demonstration purposes

export interface OnChainRecord {
  serial: string;
  date: string;
  veneer: string;
  drivers: string[];
  status: "verified" | "pending" | "invalid";
  blockNumber?: number;
  transactionHash?: string;
  owner?: string;
}

// Mock on-chain records database
const mockRecords: Record<string, OnChainRecord> = {
  "LL2024001": {
    serial: "LL2024001",
    date: "2024-01-15",
    veneer: "Walnut",
    drivers: ["PM4A-001", "PM4A-002"],
    status: "verified",
    blockNumber: 18543291,
    transactionHash: "0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b",
    owner: "0x742d35Cc6635C0532925a3b8D7Ac5C3D8B2B5E1A"
  },
  "LL2024002": {
    serial: "LL2024002",
    date: "2024-02-03",
    veneer: "Cherry",
    drivers: ["DX3-001", "DX3-002"],
    status: "verified",
    blockNumber: 18654321,
    transactionHash: "0x2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c",
    owner: "0x8a3d46Dd7746D1543939b4e8e7Bc6D4E9B3C6F2B"
  },
  "LL2024003": {
    serial: "LL2024003",
    date: "2024-02-28",
    veneer: "Oak",
    drivers: ["PM6C-001", "PM6C-002"],
    status: "pending",
    blockNumber: 18765432,
    transactionHash: "0x3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d",
    owner: "0x9b4e57Ee8857E2654a4c5f9f8cCd7E5Fa4D7G3C"
  },
  "LL2024004": {
    serial: "LL2024004",
    date: "2024-03-12",
    veneer: "Maple",
    drivers: ["PM2A-001", "PM2A-002"],
    status: "verified",
    blockNumber: 18876543,
    transactionHash: "0x4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e",
    owner: "0xAc5f68Ff9968F3765b5d6g0g9dDe8F6Gb5E8H4D"
  }
};

export function getMockRecord(serial: string): OnChainRecord | null {
  return mockRecords[serial] || null;
}

export function getAllMockRecords(): OnChainRecord[] {
  return Object.values(mockRecords);
}

export function generateMockSerial(): string {
  const year = new Date().getFullYear();
  const randomNum = Math.floor(Math.random() * 9999).toString().padStart(4, '0');
  return `LL${year}${randomNum}`;
}

export function mockVerifySerial(serial: string): {
  success: boolean;
  record?: OnChainRecord;
  error?: string;
} {
  const record = getMockRecord(serial);
  
  if (!record) {
    return {
      success: false,
      error: "Serial number not found in blockchain records"
    };
  }
  
  if (record.status === "invalid") {
    return {
      success: false,
      error: "Serial number marked as invalid"
    };
  }
  
  return {
    success: true,
    record
  };
}

// Mock blockchain network info
export const mockNetworkInfo = {
  network: "Ethereum Mainnet",
  contractAddress: "0x1234567890abcdef1234567890abcdef12345678",
  lastBlock: 18987654,
  gasPrice: "0.00000002 ETH"
};
