"use client"

import { motion } from "framer-motion"
import { GraduationCap, Target, Clock, BookOpen, Brain, Sparkles } from "lucide-react"
import { AppBar, Toolbar, Typography, Button, Container } from "@mui/material"
import ThemeToggle from "./ThemeComponents/ThemeToggle"
import FlashCard from "./homepageComponents/FlashCard"
import ProgressStats from "./homepageComponents/ProgressStats"
import FeatureCard from "./homepageComponents/FeatureCard"
import { useNavigate } from "react-router-dom";

// Sample data remains the same
const sampleCards = [
  {
    id: 1,
    question: "What is the capital of France?",
    answer: "Paris",
  },
  {
    id: 2,
    question: "What is the chemical symbol of Gold?",
    answer: "Au",
  },
  {
    id: 3,
    question: "What is the biggest planet in our Solar system?",
    answer: "Jupiter",
  },
]

const features = [
  {
    Icon: GraduationCap,
    title: "Build decks effortlessly",
    description: "Create custom flashcard decks with our intuitive interface. Import content or start from scratch.",
  },
  {
    Icon: Target,
    title: "Track your Study progress",
    description: "Monitor your learning journey with detailed analytics and progress tracking.",
  },
  {
    Icon: Clock,
    title: "Review at the perfect time",
    description: "Our spaced repetition system ensures you review cards at optimal intervals.",
  },
  {
    Icon: BookOpen,
    title: "Smart Learning Paths",
    description: "Follow structured learning paths designed to maximize your retention and understanding.",
  },
  {
    Icon: Brain,
    title: "Memory Techniques",
    description: "Learn and apply proven memory techniques to enhance your study sessions.",
  },
  {
    Icon: Sparkles,
    title: "Personalized Insights",
    description: "Get personalized recommendations based on your learning patterns and progress.",
  },
]

export default function Homepage() {
  const navigate = useNavigate();
  return (
    <div
      style={{
        backgroundColor: (theme) =>
          theme.palette.mode === "dark" ? theme.palette.background.default : theme.palette.background.default,
        minHeight: "100vh",
        transition: "background-color 0.3s ease",
      }}
    >
      <AppBar
        position="sticky"
        sx={{
          bgcolor: (theme) =>
            theme.palette.mode === "dark" ? theme.palette.background.nav : theme.palette.background.nav,
        }}
      >
        <Toolbar>
          <Typography variant="h5" component="h1" sx={{ flexGrow: 1, fontWeight: "bold" }}>
            Flashlearn
          </Typography>
          <div className="flex gap-4 items-center">
            <ThemeToggle />
            <Button
              variant="contained"
              sx={{
                bgcolor: (theme) => (theme.palette.mode === "dark" ? "primary.dark" : "primary.main"),
                color: (theme) => (theme.palette.mode === "dark" ? "white" : "text.primary"),
                "&:hover": {
                  bgcolor: (theme) => (theme.palette.mode === "dark" ? "primary.dark" : "primary.main"),
                  opacity: 0.9,
                },
              }}
              component={motion.button}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate("/login")}
            >
              Login
            </Button>
          </div>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 6 }}>
        <div className="text-center">
          <Typography variant="h3" component="h2" sx={{ mb: 2 }}>
            Master Any Subject with Smart Flashcards! 📚
          </Typography>
          <Typography variant="h6" sx={{ mb: 8, color: "text.secondary", maxWidth: "2xl", mx: "auto" }}>
            Create personalized decks, track your progress, and optimize your learning with spaced repetition.
          </Typography>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {features.map((feature, index) => (
              <FeatureCard key={index} {...feature} />
            ))}
          </div>

          <Button
            variant="contained"
            size="large"
            sx={{
              mb: 8,
              bgcolor: (theme) => (theme.palette.mode === "dark" ? "primary.dark" : "primary.main"),
              color: (theme) => (theme.palette.mode === "dark" ? "white" : "text.primary"),
              "&:hover": {
                bgcolor: (theme) => (theme.palette.mode === "dark" ? "primary.dark" : "primary.main"),
                opacity: 0.9,
              },
            }}
            component={motion.button}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Start learning today
          </Button>

          <Typography variant="h4" sx={{ mb: 4 }}>
            Try Our Interactive Flashcards
          </Typography>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {sampleCards.map((card) => (
              <FlashCard key={card.id} {...card} />
            ))}
          </div>

          <ProgressStats />
        </div>
      </Container>

      <Container
        component="footer"
        maxWidth="lg"
        sx={{
          textAlign: "center",
          py: 4,
          mt: 8,
          borderTop: 1,
          borderColor: "divider",
        }}
      >
        <Typography variant="body2" sx={{ mb: 2, color: "text.secondary" }}>
          © 2025 Flashlearn. All rights reserved.
        </Typography>
        <div className="flex justify-center gap-4">
          {["Terms", "Privacy", "Contact"].map((item) => (
            <Button
              key={item}
              variant="text"
              sx={{
                color: "text.secondary",
                "&:hover": { color: "text.primary" },
              }}
            >
              {item}
            </Button>
          ))}
        </div>
      </Container>
    </div>
  )
}

