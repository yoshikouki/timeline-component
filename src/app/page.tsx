import Image from 'next/image'
import Timeline from './Timeline'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Timeline />
    </main>
  )
}
