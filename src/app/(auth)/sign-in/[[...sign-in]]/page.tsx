import { SignIn } from '@clerk/nextjs'

export default function SignInPage() {
  return (
    <SignIn
      appearance={{
        elements: {
          formButtonPrimary: 'bg-indigo-500 hover:bg-indigo-600 text-sm normal-case',
          card: 'bg-[#0F172A] border border-white/10 shadow-2xl shadow-black/50',
          headerTitle: 'text-white font-syne',
          headerSubtitle: 'text-slate-400',
          socialButtonsBlockButton: 'bg-[#1E293B] border border-white/10 text-white hover:bg-[#334155]',
          dividerLine: 'bg-white/10',
          dividerText: 'text-slate-500',
          formFieldLabel: 'text-slate-300',
          formFieldInput: 'bg-[#1E293B] border-white/10 text-white focus:border-indigo-500',
          footerActionLink: 'text-indigo-400 hover:text-indigo-300',
          identityPreviewText: 'text-slate-300',
          identityPreviewEditButton: 'text-indigo-400',
        },
      }}
    />
  )
}
