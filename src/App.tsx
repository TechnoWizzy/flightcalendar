import {
    QueryClient,
    QueryClientProvider,
} from '@tanstack/react-query'
import FlightCalender from "./FlightCalender.tsx";

const queryClient = new QueryClient()

export default function App() {

  return (
      <QueryClientProvider client={queryClient}>
          <FlightCalender />
      </QueryClientProvider>
  )
}