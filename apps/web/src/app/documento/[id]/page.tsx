'use client';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { DocumentViewer } from '../../../shared/components/document-viewer';
import { MOCK_DOCUMENTS } from '../../../shared/data/mock-documents';

export default function DocumentoDetailPage() {
  const params = useParams();
  const router = useRouter();
  const idOrSlug = params.id as string;

  const doc =
    MOCK_DOCUMENTS.find((d) => d.id === idOrSlug || d.slug === idOrSlug) ||
    MOCK_DOCUMENTS[0];

  return (
    <div className="page-container py-8 sm:py-12">
      <div className="mb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-bold text-primary transition hover:underline"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          <span>Volver al inicio</span>
        </Link>
      </div>

      <DocumentViewer doc={doc} onClose={() => router.push('/')} />
    </div>
  );
}
