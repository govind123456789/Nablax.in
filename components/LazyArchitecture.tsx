"use client"

import dynamic from "next/dynamic"
import { Skeleton } from "@/components/ui/skeleton"

const ArchitectureFallback = () => (
  <div className="w-full py-32 bg-gradient-to-br from-[#020617] via-[#0c1629] to-[#020617]">
    <div className="container mx-auto px-6 max-w-6xl">
      <div className="space-y-8">
        <div className="text-center space-y-4">
          <Skeleton className="h-12 w-64 mx-auto bg-white/5" />
          <Skeleton className="h-6 w-96 mx-auto bg-white/5" />
        </div>
        <div className="grid md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-64 bg-white/5" />
          ))}
        </div>
      </div>
    </div>
  </div>
)

// Lazy load architecture components with loading fallback
export const LazyQueryMindArchitecture = dynamic(() => import("@/components/querymind/QueryMindArchitectureDiagram"), {
  loading: () => <ArchitectureFallback />,
  ssr: false, // Disable SSR for heavy SVG components
})

export const LazyDataSentinelArchitecture = dynamic(() => import("@/components/datasentinel/Architecture"), {
  loading: () => <ArchitectureFallback />,
  ssr: false,
})

export const LazyRootSenseArchitecture = dynamic(() => import("@/components/rootsense/Architecture"), {
  loading: () => <ArchitectureFallback />,
  ssr: false,
})

export const LazyEduVerseArchitecture = dynamic(() => import("@/components/eduverse/Architecture"), {
  loading: () => <ArchitectureFallback />,
  ssr: false,
})
