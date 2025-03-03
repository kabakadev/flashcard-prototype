import {
  Grid,
  Card,
  CardContent,
  Box,
  Typography,
  Divider,
  Chip,
  Paper,
  Button,
  useTheme,
} from "@mui/material";
import { BookOpen, AlertCircle, PlayCircle } from "lucide-react";

const DecksList = ({ decks, onDeckClick, onCreateDeckClick }) => {
  const theme = useTheme();

  // Log the decks prop to debug
  console.log("decks:", decks);

  // Ensure decks is always an array
  const safeDecks = Array.isArray(decks) ? decks : [];

  if (safeDecks.length === 0) {
    return <EmptyDeckState onCreateDeckClick={onCreateDeckClick} />;
  }

  return (
    <Grid container spacing={3}>
      {safeDecks.map((deck) => {
        return (
          <Grid item xs={12} sm={6} md={4} key={deck.id}>
            <DeckCard deck={deck} onClick={() => onDeckClick(deck.id)} />
          </Grid>
        );
      })}
    </Grid>
  );
};

const DeckCard = ({ deck, onClick }) => {
  const theme = useTheme();

  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        borderRadius: 2,
        transition: "transform 0.2s",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: 4,
        },
      }}
    >
      <Box
        sx={{
          p: 2,
          bgcolor:
            theme.palette.mode === "dark" ? "primary.dark" : "primary.light",
          color: "primary.contrastText",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h6" fontWeight="bold">
          {deck.title}
        </Typography>
        <BookOpen size={20} />
      </Box>
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mb: 2,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            textOverflow: "ellipsis",
            height: "40px",
          }}
        >
          {deck.description}
        </Typography>
        <Divider sx={{ my: 1.5 }} />
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mt: 1,
          }}
        >
          <Chip
            label={deck.subject}
            size="small"
            sx={{
              bgcolor: "accent.light",
              color: "text.primary",
              fontWeight: 500,
            }}
          />
        </Box>
      </CardContent>
      <Box sx={{ p: 2, borderTop: 1, borderColor: "divider" }}>
        <Button
          variant="contained"
          fullWidth
          startIcon={<PlayCircle size={18} />}
          onClick={onClick}
          sx={{
            bgcolor: "primary.main",
            color: "primary.contrastText",
            "&:hover": {
              bgcolor: "primary.dark",
            },
            borderRadius: 2,
          }}
        >
          Study Now
        </Button>
      </Box>
    </Card>
  );
};

const EmptyDeckState = ({ onCreateDeckClick }) => {
  const theme = useTheme();

  return (
    <Paper
      elevation={0}
      sx={{
        p: 4,
        borderRadius: 2,
        bgcolor: "background.paper",
        border: 1,
        borderColor: "divider",
        textAlign: "center",
      }}
    >
      <AlertCircle size={48} color={theme.palette.text.secondary} />
      <Typography variant="h6" sx={{ mt: 2 }}>
        No decks found
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Create your first deck to start studying
      </Typography>
      <Button variant="contained" color="primary" onClick={onCreateDeckClick}>
        Create Deck
      </Button>
    </Paper>
  );
};

export default DecksList;
