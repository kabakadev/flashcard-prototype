import { ThemeProvider } from "./components/ThemeProvider"
import Homepage from "./components/HomePage"

export default function App() {
  return (
    <ThemeProvider>
      <Homepage />
    </ThemeProvider>
  )
}

