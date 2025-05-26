import { createToken, queryTokens } from 'hello-tokens';
import { Hash } from '@bsv/sdk';

export interface ThoughtData {
  title: string;
  content: string;
  isPrivate: boolean;
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
  const message = `${data.title}|||${data.content}|||${data.isPrivate}|||${Date.now()}`;
  
  // Use BSV SDK HMAC implementation
  let hmacHasher = new Hash.SHA256HMAC('key');
  hmacHasher.update(message);
  let hmacMessageHex = hmacHasher.digestHex();
  
  console.log('Generated hash for message:', message);
  console.log('Hash:', hmacMessageHex);
  
  return hmacMessageHex;
};

export const generateHashForVerification = async (title: string, content: string, isPrivate: boolean, timestamp: number, key: string = 'key'): Promise<string> => {
  const message = `${title}|||${content}|||${isPrivate}|||${timestamp}`;
  
  // Use BSV SDK HMAC implementation
  let hmacHasher = new Hash.SHA256HMAC(key);
  hmacHasher.update(message);
  let hmacMessageHex = hmacHasher.digestHex();
  
  return hmacMessageHex;
};

export const submitToBlockchain = async (hash: string): Promise<string> => {
  console.log('Submitting hash to blockchain:', hash);
  
  // Create a token that embeds the given UTF-8 message
  const result = await createToken(hash);
  
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

export const queryAllTokens = async (): Promise<HelloWorldToken[]> => {
  console.log('Querying all tokens from blockchain');
  
  // Look up all tokens with default parameters
  const tokens = await queryTokens({
    limit: 100
  });
  
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
