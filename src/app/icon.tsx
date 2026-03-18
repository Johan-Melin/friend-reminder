import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const size = { width: 32, height: 32 }
export const contentType = 'image/png'

export default function Icon() {
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
          borderRadius: '20%',
        }}
      >
        <img
          src="https://cdn.jsdelivr.net/npm/twemoji@14.0.2/assets/svg/1f48c.svg"
          width={22}
          height={22}
        />
      </div>
    ),
    { width: 32, height: 32 }
  )
}
