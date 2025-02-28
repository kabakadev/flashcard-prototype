import { Box, Typography, Grid } from "@mui/material";
import {
  GraduationCap,
  Target,
  Clock,
  BookOpen,
  Brain,
  Sparkles,
} from "lucide-react";
import FeatureCard from "./FeatureCard";

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

export default function FeaturesSection() {
  return (
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
        Our platform combines proven learning techniques with modern technology
        to help you learn faster and remember longer.
      </Typography>

      <Grid container spacing={4}>
        {features.map((feature, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <FeatureCard {...feature} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
