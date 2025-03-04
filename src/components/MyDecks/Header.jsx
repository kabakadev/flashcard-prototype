"use client";

import { Box, Typography, Button } from "@mui/material";
import { BookOpen, Plus } from "lucide-react";
import { motion } from "framer-motion";
import { memo } from "react";

const Header = ({ onCreateDeck }) => (
  <motion.div
    initial={{ opacity: 0, y: -10 }} // Reduced animation distance
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }} // Reduced animation duration
  >
    <Box sx={{ mb: 4 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontWeight: "bold",
            color: "text.primary",
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <BookOpen size={32} />
          My Flashcard Decks
        </Typography>
        <Button
          variant="contained"
          startIcon={<Plus size={18} />}
          onClick={onCreateDeck}
          sx={{
            bgcolor: "primary.main",
            color: "primary.contrastText",
            "&:hover": {
              bgcolor: "primary.dark",
            },
            borderRadius: 2,
          }}
        >
          Create New Deck
        </Button>
      </Box>
      <Typography variant="body1" sx={{ color: "text.secondary" }}>
        Manage your flashcard decks and track your learning progress
      </Typography>
    </Box>
  </motion.div>
);

// Export as memoized component
export default memo(Header);
