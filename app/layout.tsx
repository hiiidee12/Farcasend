import './globals.css'
import type { Metadata } from 'next'
import { WagmiProvider } from 'wagmi'
import { wagmiConfig } from '@/src/wagmi'

export const metadata: Metadata = {
  title: 'Farcasend',
  description: 'Batch transfer ETH/tokens to many wallets from Farcaster',
  openGraph: {
    title: 'Farcasend',
    description: 'Batch transfer to many wallets',
    url: 'https://farca-send.vercel.app',
    images: ['https://farca-send.vercel.app/farca.png'],
  },
  icons: {
    icon: '/farca.png',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body>
        <WagmiProvider config={wagmiConfig}>{children}</WagmiProvider>
      </body>
    </html>
  )
}
