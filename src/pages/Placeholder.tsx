import { Link } from 'react-router-dom'
import { Screen } from '@/components/layout/Screen'
import { Eyebrow, PageTitle } from '@/components/ui/Text'

export default function Placeholder({ eyebrow, title, body }: { eyebrow: string; title: string; body: string }) {
  return (
    <Screen nav>
      <div className="flex flex-col gap-2 pt-4">
        <Eyebrow>{eyebrow}</Eyebrow>
        <PageTitle>{title}</PageTitle>
      </div>
      <div className="flex flex-col gap-2 rounded-md border border-dashed border-line-strong p-6 text-center">
        <span className="font-sans text-[15px] font-semibold">Coming soon</span>
        <span className="text-[15px] leading-6 text-muted">{body}</span>
        <Link to="/" className="mt-2 font-sans text-sm font-semibold">
          Back to home
        </Link>
      </div>
    </Screen>
  )
}
