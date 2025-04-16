"use client";

import { useState, ChangeEvent, FormEvent } from 'react';
import { uploadFileToPinata, uploadJSONToPinata } from '../lib/pinata';

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [ipfsHash, setIpfsHash] = useState('');

  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setFile(e.target.files[0]);
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!file) return alert('Please select a file');

    // Upload file to Pinata
    const fileRes = await uploadFileToPinata(file);
    const fileHash = fileRes.IpfsHash;

    // Create metadata JSON
    const metadata = {
      name,
      description,
      image: `ipfs://${fileHash}`,
    };

    // Upload metadata JSON to Pinata
    const metadataRes = await uploadJSONToPinata(metadata);
    setIpfsHash(metadataRes.IpfsHash);
  };

  return (
    <div>
      <h1>Upload NFT to Pinata</h1>
      <form onSubmit={onSubmit}>
        <input type="file" onChange={onFileChange} accept="image/*" />
        <input
          type="text"
          placeholder="NFT Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <textarea
          placeholder="NFT Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <button type="submit">Upload</button>
      </form>
      {ipfsHash && (
        <p>
          Metadata IPFS Hash: <a href={`https://gateway.pinata.cloud/ipfs/${ipfsHash}`} target="_blank" rel="noreferrer">{ipfsHash}</a>
        </p>
      )}
    </div>
  );
}