"use client";

import { Grid, Card, Typography, Button, Box } from "@mui/material";
import { motion } from "framer-motion";
import { Brain, PlayCircle, Plus } from "lucide-react";
import FlashcardItem from "./FlashcardItem";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

const FlashcardList = ({
  flashcards,
  onEdit,
  onDelete,
  navigate,
  deckId,
  onAddFlashcard,
  is_default, // Add is_default prop
}) => (
  <motion.div variants={containerVariants} initial="hidden" animate="visible">
    {flashcards.length === 0 ? (
      <Card
        sx={{
          borderRadius: 3,
          boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
          p: 6,
          textAlign: "center",
          bgcolor: "background.paper",
        }}
      >
        <Brain size={48} color="primary.main" style={{ marginBottom: 16 }} />
        <Typography
          variant="h5"
          sx={{ color: "text.primary", mb: 2, fontWeight: "bold" }}
        >
          No Flashcards Yet
        </Typography>
        <Typography variant="body1" sx={{ color: "text.secondary", mb: 4 }}>
          Create your first flashcard and start learning!
        </Typography>
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
          Create Your First Flashcard
        </Button>
      </Card>
    ) : (
      <>
        <Grid container spacing={3}>
          {flashcards.map((flashcard) => (
            <Grid item xs={12} sm={6} md={4} key={flashcard.id}>
              <FlashcardItem
                flashcard={flashcard}
                onEdit={onEdit}
                onDelete={onDelete}
                is_default={is_default} // Pass the is_default flag
              />
            </Grid>
          ))}
        </Grid>

        <Box sx={{ mt: 6, textAlign: "center" }}>
          <Button
            variant="contained"
            size="large"
            startIcon={<PlayCircle size={20} />}
            onClick={() => navigate(`/study/${deckId}`)}
            sx={{
              bgcolor: "primary.main",
              color: "primary.contrastText",
              px: 6,
              py: 1.5,
              "&:hover": {
                bgcolor: "primary.dark",
              },
              borderRadius: 2,
            }}
          >
            Start Studying
          </Button>
        </Box>
      </>
    )}
  </motion.div>
);

export default FlashcardList;
