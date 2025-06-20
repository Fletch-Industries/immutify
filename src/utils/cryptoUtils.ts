import { createToken, queryTokens } from 'hello-tokens';
import { Hash } from '@bsv/sdk';

export interface ThoughtData {
  title: string;
  content: string;
  isPrivate: boolean;
  mediaFile?: File;
}

export interface HelloWorldToken {
  message: string;
  token: {
    txid: string;
    outputIndex: number;
    lockingScript: string;
    satoshis: number;
  };
}

export const generateHash = async (data: ThoughtData): Promise<string> => {  
  let hmacHasher = new Hash.SHA256HMAC(data.title);
  
  // Add content to hash
  if (data.content) {
    hmacHasher.update(data.content);
  }
  
  // Add media file to hash if present
  if (data.mediaFile) {
    const fileData = await readFileAsNumberArray(data.mediaFile);
    hmacHasher.update(fileData);
  }
  
  let hmacMessageHex = hmacHasher.digestHex();
  
  console.log('Generated combined hash for:', {
    title: data.title,
    hasContent: !!data.content,
    hasMedia: !!data.mediaFile
  });
  console.log('Hash:', hmacMessageHex);
  
  return hmacMessageHex;
};

export const generateFileHash = async (file: File, title: string): Promise<string> => {
  const fileData = await readFileAsNumberArray(file);
  
  let hmacHasher = new Hash.SHA256HMAC(title);
  hmacHasher.update(fileData);
  let hmacMessageHex = hmacHasher.digestHex();
  
  console.log('Generated hash for file:', file.name);
  console.log('File hash:', hmacMessageHex);
  
  return hmacMessageHex;
};

export const generateHashForVerification = async (title: string, content: string, mediaFile?: File): Promise<string> => {  
  let hmacHasher = new Hash.SHA256HMAC(title);
  
  // Add content to hash
  if (content) {
    hmacHasher.update(content);
  }
  
  // Add media file to hash if present
  if (mediaFile) {
    const fileData = await readFileAsNumberArray(mediaFile);
    hmacHasher.update(fileData);
  }
  
  let hmacMessageHex = hmacHasher.digestHex();
  
  console.log('Generated verification hash for:', {
    title,
    hasContent: !!content,
    hasMedia: !!mediaFile
  });
  console.log('Hash:', hmacMessageHex);
  
  return hmacMessageHex;
};

// Helper function to read file as number array
const readFileAsNumberArray = (file: File): Promise<number[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const arrayBuffer = e.target?.result as ArrayBuffer;
        const uint8Array = new Uint8Array(arrayBuffer);
        const numberArray = Array.from(uint8Array);
        resolve(numberArray);
      } catch (error) {
        console.error('Error reading file:', error);
        reject(error);
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    reader.readAsArrayBuffer(file);
  });
};

export const submitToBlockchain = async (data: string): Promise<string> => {
  console.log('Submitting data to blockchain:', data);
  
  // Create a token that embeds the given UTF-8 message
  const result = await createToken(data);
  
  console.log('Blockchain response:', result);
  
  // Extract transaction ID from the response
  if (result && typeof result === 'object' && 'txid' in result) {
    return result.txid as string;
  } else if (result && typeof result === 'object' && 'error' in result) {
    throw new Error(`Blockchain submission failed: ${result.error}`);
  } else {
    throw new Error('Unexpected response from blockchain');
  }
};

export const queryAllTokens = async (options: {
  limit: number;
  skip?: number;
  sortOrder?: 'asc' | 'desc';
} = { limit: 100 }): Promise<HelloWorldToken[]> => {
  console.log('Querying tokens from blockchain with options:', options);
  
  // Look up tokens with pagination parameters
  const tokens = await queryTokens(options);
  
  console.log('Query results:', tokens);
  return tokens as HelloWorldToken[];
};

export const queryBlockchain = async (hash: string): Promise<any[]> => {
  console.log('Querying blockchain for hash:', hash);
  
  // Look it up via the ls_helloworld overlay
  const tokens = await queryTokens({
    limit: 10,
    message: hash
  });
  
  console.log('Query results:', tokens);
  return tokens;
};
