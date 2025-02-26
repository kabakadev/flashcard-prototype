"use client";

import { motion } from "framer-motion";
import {
  GraduationCap,
  Target,
  Clock,
  BookOpen,
  Brain,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Box,
  Grid,
  Card,
  CardContent,
  useTheme,
  Divider,
} from "@mui/material";
import ThemeToggle from "./ThemeComponents/ThemeToggle";
import FlashCard from "./homepageComponents/FlashCard";
import ProgressStats from "./homepageComponents/ProgressStats";
import FeatureCard from "./homepageComponents/FeatureCard";

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
];

const features = [
  {
    Icon: GraduationCap,
    title: "Build decks effortlessly",
    description:
      "Create custom flashcard decks with our intuitive interface. Import content or start from scratch.",
  },
  {
    Icon: Target,
    title: "Track your Study progress",
    description:
      "Monitor your learning journey with detailed analytics and progress tracking.",
  },
  {
    Icon: Clock,
    title: "Review at the perfect time",
    description:
      "Our spaced repetition system ensures you review cards at optimal intervals.",
  },
  {
    Icon: BookOpen,
    title: "Smart Learning Paths",
    description:
      "Follow structured learning paths designed to maximize your retention and understanding.",
  },
  {
    Icon: Brain,
    title: "Memory Techniques",
    description:
      "Learn and apply proven memory techniques to enhance your study sessions.",
  },
  {
    Icon: Sparkles,
    title: "Personalized Insights",
    description:
      "Get personalized recommendations based on your learning patterns and progress.",
  },
];

export default function Homepage() {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";

  return (
    <Box
      sx={{
        bgcolor: "background.default",
        minHeight: "100vh",
        transition: "background-color 0.3s ease",
      }}
    >
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          bgcolor: "background.nav",
          borderBottom: 1,
          borderColor: "divider",
        }}
      >
        <Toolbar>
          <Typography
            variant="h5"
            component="h1"
            sx={{ flexGrow: 1, fontWeight: "bold", color: "text.primary" }}
          >
            Flashlearn
          </Typography>
          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            <ThemeToggle />
            <Button
              variant="outlined"
              sx={{
                borderColor: "primary.main",
                color: "primary.main",
                "&:hover": {
                  borderColor: "primary.dark",
                  bgcolor: "rgba(67, 97, 238, 0.04)",
                },
              }}
              component={motion.button}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Sign In
            </Button>
            <Button
              variant="contained"
              sx={{
                bgcolor: "primary.main",
                color: "primary.contrastText",
                "&:hover": {
                  bgcolor: "primary.dark",
                },
              }}
              component={motion.button}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Get Started
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Hero Section */}
      <Box
        sx={{
          py: 10,
          bgcolor: isDarkMode ? "background.default" : "background.nav",
          borderBottom: 1,
          borderColor: "divider",
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Typography
                  variant="h2"
                  component="h2"
                  sx={{
                    mb: 2,
                    fontWeight: 800,
                    color: "text.primary",
                    lineHeight: 1.2,
                  }}
                >
                  Master Any Subject with Smart Flashcards
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    mb: 4,
                    color: "text.secondary",
                    fontWeight: "normal",
                  }}
                >
                  Create personalized decks, track your progress, and optimize
                  your learning with spaced repetition.
                </Typography>
                <Box sx={{ display: "flex", gap: 2 }}>
                  <Button
                    variant="contained"
                    size="large"
                    sx={{
                      bgcolor: "primary.main",
                      color: "primary.contrastText",
                      px: 4,
                      py: 1.5,
                      "&:hover": {
                        bgcolor: "primary.dark",
                      },
                    }}
                    component={motion.button}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    endIcon={<ArrowRight />}
                  >
                    Start learning for free
                  </Button>
                  <Button
                    variant="outlined"
                    size="large"
                    sx={{
                      borderColor: "primary.main",
                      color: "primary.main",
                      px: 4,
                      py: 1.5,
                      "&:hover": {
                        borderColor: "primary.dark",
                        bgcolor: "rgba(67, 97, 238, 0.04)",
                      },
                    }}
                    component={motion.button}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    How it works
                  </Button>
                </Box>
              </motion.div>
            </Grid>
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Box
                  sx={{
                    position: "relative",
                    height: "400px",
                    width: "100%",
                    borderRadius: 4,
                    overflow: "hidden",
                    boxShadow:
                      "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                  }}
                >
                  <Box
                    component="img"
                    src="https://images.unsplash.com/photo-1625750331870-624de6fd3452?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fG1hc3Rlcnl8ZW58MHx8MHx8fDA%3D"
                    alt="Chess king representing mastery"
                    sx={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </Box>
              </motion.div>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 8 }}>
        {/* Features Section */}
        <Box sx={{ mb: 10 }}>
          <Typography
            variant="h3"
            component="h2"
            align="center"
            sx={{
              mb: 2,
              fontWeight: "bold",
              color: "text.primary",
            }}
          >
            Features Designed for Effective Learning
          </Typography>
          <Typography
            variant="h6"
            align="center"
            sx={{
              mb: 6,
              color: "text.secondary",
              maxWidth: "800px",
              mx: "auto",
              fontWeight: "normal",
            }}
          >
            Our platform combines proven learning techniques with modern
            technology to help you learn faster and remember longer.
          </Typography>

          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <FeatureCard {...feature} />
              </Grid>
            ))}
          </Grid>
        </Box>

        <Divider sx={{ my: 8 }} />

        {/* Try Flashcards Section */}
        <Box sx={{ mb: 10 }}>
          <Typography
            variant="h3"
            component="h2"
            align="center"
            sx={{
              mb: 2,
              fontWeight: "bold",
              color: "text.primary",
            }}
          >
            Try Our Interactive Flashcards
          </Typography>
          <Typography
            variant="h6"
            align="center"
            sx={{
              mb: 6,
              color: "text.secondary",
              maxWidth: "800px",
              mx: "auto",
              fontWeight: "normal",
            }}
          >
            Experience how our flashcards work with these sample cards. Click to
            flip and test your knowledge.
          </Typography>

          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: 4,
              mb: 6,
            }}
          >
            {sampleCards.map((card) => (
              <FlashCard key={card.id} {...card} />
            ))}
          </Box>

          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Button
              variant="contained"
              size="large"
              sx={{
                bgcolor: "primary.main",
                color: "primary.contrastText",
                px: 4,
                py: 1.5,
                "&:hover": {
                  bgcolor: "primary.dark",
                },
              }}
              component={motion.button}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Create your own flashcards
            </Button>
          </Box>
        </Box>

        <Divider sx={{ my: 8 }} />

        {/* Progress Stats Section */}
        <Box sx={{ mb: 10 }}>
          <Typography
            variant="h3"
            component="h2"
            align="center"
            sx={{
              mb: 2,
              fontWeight: "bold",
              color: "text.primary",
            }}
          >
            Track Your Learning Progress
          </Typography>
          <Typography
            variant="h6"
            align="center"
            sx={{
              mb: 6,
              color: "text.secondary",
              maxWidth: "800px",
              mx: "auto",
              fontWeight: "normal",
            }}
          >
            Visualize your learning journey with detailed analytics and progress
            tracking to stay motivated.
          </Typography>

          <ProgressStats />
        </Box>

        {/* Personalized Learning Section */}
        <Box sx={{ mb: 10 }}>
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Typography
                  variant="h3"
                  component="h2"
                  sx={{
                    mb: 2,
                    fontWeight: "bold",
                    color: "text.primary",
                  }}
                >
                  Your Journey, Your Way
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    mb: 4,
                    color: "text.secondary",
                    fontSize: "1.1rem",
                    lineHeight: 1.6,
                  }}
                >
                  Flashlearn adapts to your unique learning style, creating a
                  personalized experience that helps you achieve your goals
                  faster:
                </Typography>

                <Box component="ul" sx={{ pl: 2, mb: 4 }}>
                  {[
                    "Create custom flashcards tailored to your specific needs",
                    "Develop your own learning rhythm with flexible study schedules",
                    "Focus on challenging topics with smart repetition algorithms",
                    "Track your personal growth with detailed performance insights",
                  ].map((item, index) => (
                    <Box
                      component="li"
                      key={index}
                      sx={{
                        mb: 2,
                        color: "text.primary",
                        fontSize: "1rem",
                      }}
                    >
                      {item}
                    </Box>
                  ))}
                </Box>

                <Button
                  variant="contained"
                  size="large"
                  sx={{
                    bgcolor: "primary.main",
                    color: "primary.contrastText",
                    px: 4,
                    py: 1.5,
                    "&:hover": {
                      bgcolor: "primary.dark",
                    },
                  }}
                  component={motion.button}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Start your learning journey
                </Button>
              </motion.div>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card
                sx={{
                  borderRadius: 4,
                  overflow: "hidden",
                  boxShadow:
                    "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                }}
              >
                <CardContent sx={{ p: 0 }}>
                  <Box
                    component="img"
                    src="https://images.unsplash.com/photo-1729710877311-0e8e70bf820b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fGxlYXJuaW5nJTIwZmxhc2hjYXJkJTIwYWVzdGhldGljfGVufDB8fDB8fHww"
                    alt="Hand writing on blank notes"
                    sx={{
                      width: "100%",
                      height: "400px",
                      objectFit: "cover",
                    }}
                  />
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </Container>

      <Box
        component="footer"
        sx={{
          py: 6,
          bgcolor: isDarkMode ? "background.paper" : "background.nav",
          borderTop: 1,
          borderColor: "divider",
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Typography
                variant="h5"
                sx={{ mb: 2, fontWeight: "bold", color: "text.primary" }}
              >
                Flashlearn
              </Typography>
              <Typography
                variant="body2"
                sx={{ mb: 2, color: "text.secondary" }}
              >
                The smart way to learn anything. Create, study, and master any
                subject with our powerful flashcard platform.
              </Typography>
            </Grid>
            <Grid item xs={12} md={2}>
              <Typography
                variant="subtitle1"
                sx={{ mb: 2, fontWeight: "bold", color: "text.primary" }}
              >
                Product
              </Typography>
              <Box component="ul" sx={{ p: 0, m: 0, listStyle: "none" }}>
                {["Features", "Pricing", "Testimonials", "FAQ"].map((item) => (
                  <Box component="li" key={item} sx={{ mb: 1 }}>
                    <Button
                      variant="text"
                      sx={{
                        p: 0,
                        color: "text.secondary",
                        "&:hover": { color: "primary.main" },
                      }}
                    >
                      {item}
                    </Button>
                  </Box>
                ))}
              </Box>
            </Grid>
            <Grid item xs={12} md={2}>
              <Typography
                variant="subtitle1"
                sx={{ mb: 2, fontWeight: "bold", color: "text.primary" }}
              >
                Company
              </Typography>
              <Box component="ul" sx={{ p: 0, m: 0, listStyle: "none" }}>
                {["About", "Blog", "Careers", "Contact"].map((item) => (
                  <Box component="li" key={item} sx={{ mb: 1 }}>
                    <Button
                      variant="text"
                      sx={{
                        p: 0,
                        color: "text.secondary",
                        "&:hover": { color: "primary.main" },
                      }}
                    >
                      {item}
                    </Button>
                  </Box>
                ))}
              </Box>
            </Grid>
            <Grid item xs={12} md={2}>
              <Typography
                variant="subtitle1"
                sx={{ mb: 2, fontWeight: "bold", color: "text.primary" }}
              >
                Legal
              </Typography>
              <Box component="ul" sx={{ p: 0, m: 0, listStyle: "none" }}>
                {["Terms", "Privacy", "Cookies", "Licenses"].map((item) => (
                  <Box component="li" key={item} sx={{ mb: 1 }}>
                    <Button
                      variant="text"
                      sx={{
                        p: 0,
                        color: "text.secondary",
                        "&:hover": { color: "primary.main" },
                      }}
                    >
                      {item}
                    </Button>
                  </Box>
                ))}
              </Box>
            </Grid>
            <Grid item xs={12} md={2}>
              <Typography
                variant="subtitle1"
                sx={{ mb: 2, fontWeight: "bold", color: "text.primary" }}
              >
                Support
              </Typography>
              <Box component="ul" sx={{ p: 0, m: 0, listStyle: "none" }}>
                {["Help Center", "Community", "Resources", "Feedback"].map(
                  (item) => (
                    <Box component="li" key={item} sx={{ mb: 1 }}>
                      <Button
                        variant="text"
                        sx={{
                          p: 0,
                          color: "text.secondary",
                          "&:hover": { color: "primary.main" },
                        }}
                      >
                        {item}
                      </Button>
                    </Box>
                  )
                )}
              </Box>
            </Grid>
          </Grid>
          <Divider sx={{ my: 4 }} />
          <Typography
            variant="body2"
            align="center"
            sx={{ color: "text.secondary" }}
          >
            © {new Date().getFullYear()} Flashlearn. All rights reserved.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}
