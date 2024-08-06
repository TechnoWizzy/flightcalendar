import {
    QueryClient,
    QueryClientProvider,
} from '@tanstack/react-query'
import FlightCalender from "./FlightCalender.tsx";
import {Analytics} from "@vercel/analytics/react";

const queryClient = new QueryClient()

export default function App() {

  return (
      <QueryClientProvider client={queryClient}>
          <Analytics />
          <FlightCalender />
      </QueryClientProvider>
  )
}