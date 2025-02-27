"use client";

import { Box, Typography, Button, Breadcrumbs, Link } from "@mui/material";
import { BookOpen, Plus, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

const DeckHeader = ({ deck, onAddFlashcard, navigate }) => (
  <motion.div
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <Box sx={{ mb: 4 }}>
      <Breadcrumbs
        separator={<ChevronRight size={16} />}
        sx={{ mb: 2, color: "text.secondary" }}
      >
        <Link
          component="button"
          variant="body2"
          onClick={() => navigate("/mydecks")}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.5,
            color: "text.secondary",
            textDecoration: "none",
            "&:hover": { color: "primary.main" },
          }}
        >
          <BookOpen size={16} />
          My Decks
        </Link>
        <Typography color="text.primary">
          {deck?.title || `Deck ${deck?.id}`}
        </Typography>
      </Breadcrumbs>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Box>
          <Typography
            variant="h4"
            sx={{ fontWeight: "bold", color: "text.primary", mb: 1 }}
          >
            {deck?.title || `Deck ${deck?.id}`}
          </Typography>
          <Typography variant="body1" sx={{ color: "text.secondary" }}>
            {deck?.description || "No description available"}
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Plus size={18} />}
          onClick={onAddFlashcard}
          sx={{
            bgcolor: "primary.main",
            color: "primary.contrastText",
            "&:hover": {
              bgcolor: "primary.dark",
            },
            borderRadius: 2,
          }}
        >
          Add Flashcard
        </Button>
      </Box>
    </Box>
  </motion.div>
);

export default DeckHeader;
