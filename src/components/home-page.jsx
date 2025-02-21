import ThemeToggle from "./theme-toggle"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background dark:bg-background-dark text-text dark:text-text-dark">
      {/* Navbar */}
      <nav className="bg-navbar dark:bg-navbar-dark p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">FlashLearn</h1>
          <div className="flex gap-4 items-center">
            <ThemeToggle />
            <button className="px-4 py-2 rounded-lg bg-button dark:bg-button-dark text-text dark:text-text-dark hover:opacity-80 transition-opacity">
              Login
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-8">
        <section className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Master Any Subject with Smart Flashcards! 📝</h2>
          <p className="mb-6 text-lg">
            Create personalized decks, track your progress, and optimize your learning with spaced repetition.
          </p>
          <ul className="mb-8 space-y-2">
            <li className="flex items-center justify-center gap-2">💠 Build decks effortlessly</li>
            <li className="flex items-center justify-center gap-2">📊 Track your study progress</li>
            <li className="flex items-center justify-center gap-2">⏰ Review at the perfect time</li>
          </ul>
          <button className="px-6 py-3 rounded-lg bg-button dark:bg-button-dark text-text dark:text-text-dark hover:opacity-80 transition-opacity text-lg font-semibold">
            Start Learning Today! [Get Started]
          </button>
        </section>

        {/* Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 max-w-4xl mx-auto">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="aspect-square bg-card dark:bg-card-dark rounded-lg shadow-lg flex items-center justify-center"
            >
              card image
            </div>
          ))}
        </div>

        {/* Features Section */}
        <section className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-2xl font-bold mb-4">Master Any Topic, One Flashcard at a Time</h2>
            <p className="mb-4">Create and study your own flashcards with an intuitive, distraction-free experience.</p>
            <p>Track your progress and retain knowledge more effectively.</p>
          </div>
          <div className="aspect-video bg-card dark:bg-card-dark rounded-lg shadow-lg flex items-center justify-center">
            image
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 mt-16 text-center">
        <p>@2025 flashlearn</p>
      </footer>
    </div>
  )
}

