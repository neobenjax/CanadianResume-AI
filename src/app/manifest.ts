import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'MapleLeaf Resume PWA',
        short_name: 'MapleLeaf',
        description: 'Privacy-focused, local-first resume builder for Canadians.',
        start_url: '/',
        display: 'standalone',
        background_color: '#f8fafc',
        theme_color: '#7C3AED',
        icons: [
            {
                src: '/favicon.ico',
                sizes: 'any',
                type: 'image/x-icon',
            },
            {
                src: '/icon-192.png',
                sizes: '192x192',
                type: 'image/png',
            },
            {
                src: '/icon-512.png',
                sizes: '512x512',
                type: 'image/png',
            },
        ],
    }
}
