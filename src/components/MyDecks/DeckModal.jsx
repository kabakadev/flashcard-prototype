"use client";

import {
  Box,
  Typography,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Alert,
  Modal,
} from "@mui/material";
import { useState } from "react";

const DeckModal = ({
  open,
  onClose,
  editingDeck,
  deckTitle,
  setDeckTitle,
  deckDescription,
  setDeckDescription,
  deckSubject,
  setDeckSubject,
  deckCategory,
  setDeckCategory,
  deckDifficulty,
  setDeckDifficulty,
  onSave,
}) => {
  const [error, setError] = useState("");

  const validateForm = () => {
    if (!deckTitle.trim()) {
      setError("Title is required");
      return false;
    }
    if (!deckDescription.trim()) {
      setError("Description is required");
      return false;
    }
    if (!deckSubject.trim()) {
      setError("Subject is required");
      return false;
    }
    if (!deckCategory.trim()) {
      setError("Category is required");
      return false;
    }
    if (!deckDifficulty) {
      setError("Difficulty Level is required");
      return false;
    }
    return true;
  };

  const handleSave = () => {
    if (validateForm()) {
      setError("");
      onSave();
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="deck-modal-title"
      aria-describedby="deck-modal-description"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: { xs: "90%", sm: 500 },
          bgcolor: "background.paper",
          borderRadius: 3,
          boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
          p: 4,
        }}
      >
        <Typography
          variant="h5"
          id="deck-modal-title"
          sx={{ mb: 3, fontWeight: "bold" }}
        >
          {editingDeck ? "Edit Deck" : "Create New Deck"}
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError("")}>
            {error}
          </Alert>
        )}

        <Box
          component="form"
          sx={{ display: "flex", flexDirection: "column", gap: 3 }}
        >
          <TextField
            label="Deck Title"
            value={deckTitle}
            onChange={(e) => setDeckTitle(e.target.value)}
            fullWidth
            required
            error={!deckTitle.trim()}
            helperText={!deckTitle.trim() && "Title is required"}
          />

          <TextField
            label="Description"
            value={deckDescription}
            onChange={(e) => setDeckDescription(e.target.value)}
            fullWidth
            multiline
            rows={3}
            required
            error={!deckDescription.trim()}
            helperText={!deckDescription.trim() && "Description is required"}
          />

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Subject"
                value={deckSubject}
                onChange={(e) => setDeckSubject(e.target.value)}
                fullWidth
                required
                error={!deckSubject.trim()}
                helperText={!deckSubject.trim() && "Subject is required"}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Category"
                value={deckCategory}
                onChange={(e) => setDeckCategory(e.target.value)}
                fullWidth
                required
                error={!deckCategory.trim()}
                helperText={!deckCategory.trim() && "Category is required"}
              />
            </Grid>
          </Grid>

          <FormControl fullWidth>
            <InputLabel>Difficulty Level</InputLabel>
            <Select
              value={deckDifficulty}
              onChange={(e) => setDeckDifficulty(Number(e.target.value))}
              label="Difficulty Level"
              required
              error={!deckDifficulty}
            >
              {[1, 2, 3, 4, 5].map((level) => (
                <MenuItem key={level} value={level}>
                  {level} -{" "}
                  {level === 1
                    ? "Beginner"
                    : level === 5
                    ? "Expert"
                    : `Level ${level}`}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
            <Button
              variant="contained"
              onClick={handleSave}
              sx={{
                flex: 1,
                bgcolor: "primary.main",
                color: "primary.contrastText",
                "&:hover": {
                  bgcolor: "primary.dark",
                },
              }}
            >
              {editingDeck ? "Save Changes" : "Create Deck"}
            </Button>
            <Button
              variant="outlined"
              onClick={onClose}
              sx={{
                flex: 1,
                borderColor: "primary.main",
                color: "primary.main",
                "&:hover": {
                  borderColor: "primary.dark",
                  bgcolor: "rgba(124, 58, 237, 0.04)",
                },
              }}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default DeckModal;
