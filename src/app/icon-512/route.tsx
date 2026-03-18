import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#4f46e5',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '22%',
        }}
      >
        <img
          src="https://cdn.jsdelivr.net/npm/twemoji@14.0.2/assets/svg/1f48c.svg"
          width={320}
          height={320}
        />
      </div>
    ),
    { width: 512, height: 512 }
  )
}
