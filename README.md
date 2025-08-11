# BREAD COOPERATIVE

**The future after capital**

A web application for minting and burning BREAD tokens on Gnosis Chain.

**ALL POWER TO THE PEOPLE**

## Features

- **BAKE BREAD**: Send xDAI to mint new BREAD tokens
- **BURN BREAD**: Burn your BREAD tokens  
- **Balance Display**: View your xDAI and BREAD balances
- **MetaMask Integration**: Seamless wallet connection
- **Bread Cooperative Themed**: Official Bread Cooperative branding

## BREAD Ecosystem

- **BREAD Solidarity Fund** - Mutual aid and community support
- **BREAD Savings** - Cooperative savings programs
- **BREAD Insurance** - Community-based insurance solutions

## Contract Details

- **Network**: Gnosis Chain (Chain ID: 100)
- **Contract Address**: [`0xa555d5344f6fb6c65da19e403cb4c1ec4a1a5ee3`](https://gnosisscan.io/address/0xa555d5344f6fb6c65da19e403cb4c1ec4a1a5ee3)
- **Functions**:
  - `mint(address receiver)`: Mint BREAD by sending xDAI
  - `burn(uint256 amount, address receiver)`: Burn BREAD tokens

## Setup

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Requirements

- MetaMask or compatible Web3 wallet
- xDAI balance on Gnosis Chain for minting
- BREAD tokens for burning

## Environment Variables

Create a `.env.local` file with:

```
NEXT_PUBLIC_URL=http://localhost:3000
ALLOWED_ORIGIN=localhost:3000
```

For production, update these values accordingly.

## Farcaster Mini App

This app is configured as a Farcaster Mini App. The configuration is in `farcaster.json`.

### Deployment Steps for Farcaster

1. **Generate Required Images**: Convert SVG files to PNG (see `public/IMAGE_REQUIREMENTS.md`)
2. **Update URLs**: Update all URLs in `farcaster.json` to your production domain
3. **Deploy to Vercel/Production**: Deploy the Next.js app
4. **Submit to Farcaster**: Submit your mini app through the Farcaster developer portal

### Required Capabilities

- `actions.signIn` - User authentication
- `wallet.getEthereumProvider` - Access to wallet provider
- `wallet.switchChain` - Switch to Gnosis Chain
- `wallet.sendTransaction` - Send mint/burn transactions

## Tech Stack

- Next.js 14
- React 18
- Viem for blockchain interactions
- TailwindCSS for styling
- TypeScript

## About Bread Cooperative

Building the future after capital through cooperative economics and mutual aid.

## License

MIT