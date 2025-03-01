"use client";

import { motion } from "framer-motion";
import { Box, Typography } from "@mui/material";
import { Brain } from "lucide-react";

const StudyHeader = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: "bold",
            color: "text.primary",
            display: "flex",
            alignItems: "center",
            gap: 1,
            mb: 1,
          }}
        >
          <Brain size={32} />
          Study Dashboard
        </Typography>
        <Typography variant="body1" sx={{ color: "text.secondary" }}>
          Track your progress and choose a deck to study
        </Typography>
      </Box>
    </motion.div>
  );
};

export default StudyHeader;
