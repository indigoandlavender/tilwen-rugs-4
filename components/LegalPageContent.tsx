import { notFound } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { getLegalPage } from '@/lib/nexus'

interface LegalPageProps {
  templateId: string
}

export default async function LegalPageContent({ templateId }: LegalPageProps) {
  const page = await getLegalPage(templateId)

  if (!page) {
    notFound()
  }

  return (
    <main className="min-h-screen bg-cream">
      <Header />
      
      <article className="pt-32 pb-20 md:pt-40 md:pb-28">
        <div className="max-w-3xl mx-auto px-6">
          {/* Page Title */}
          <h1 className="font-serif text-3xl md:text-4xl text-charcoal mb-12">
            {page.title}
          </h1>
          
          {/* Sections */}
          <div className="space-y-10 text-charcoal/80">
            {page.sections.map((section, index) => (
              <section key={index}>
                <h2 className="text-lg font-medium text-charcoal mb-4">
                  {section.title}
                </h2>
                <div className="text-sm leading-relaxed whitespace-pre-line">
                  {section.content}
                </div>
              </section>
            ))}
          </div>

          {/* Last Updated */}
          <p className="mt-16 text-xs text-charcoal/40 uppercase tracking-wider">
            Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </p>
        </div>
      </article>

      <Footer />
    </main>
  )
}
