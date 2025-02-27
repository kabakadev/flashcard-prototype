"use client";

import { Box, Typography } from "@mui/material";
import { motion } from "framer-motion";

const WelcomeSection = ({ username }) => (
  <motion.div
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <Box sx={{ mb: 4 }}>
      <Typography
        variant="h4"
        sx={{ fontWeight: "bold", color: "text.primary", mb: 1 }}
      >
        Welcome back, {username || "Learner"}!
      </Typography>
      <Typography variant="body1" sx={{ color: "text.secondary" }}>
        Track your progress, review your decks, and continue your learning
        journey.
      </Typography>
    </Box>
  </motion.div>
);

export default WelcomeSection;
