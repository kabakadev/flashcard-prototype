import {
  Grid,
  Card,
  CardContent,
  CardActionArea,
  Box,
  Typography,
  Divider,
  Chip,
  Paper,
  Button,
  useTheme,
} from "@mui/material";
import { BookOpen, AlertCircle } from "lucide-react";

const DecksList = ({ decks, onDeckClick, onCreateDeckClick }) => {
  const theme = useTheme();

  // Log the decks prop to debug
  console.log("decks:", decks);

  // Ensure decks is always an array
  const safeDecks = Array.isArray(decks) ? decks : [];

  // Calculate due for review based on spaced repetition algorithm
  const getDueStatus = (deck) => {
    // This is a placeholder - in a real app, you would calculate this based on
    // the user's progress and the spaced repetition algorithm
    const random = Math.random();
    if (random < 0.3) return "Due";
    if (random < 0.6) return "Soon";
    return "Later";
  };

  // Get color based on due status
  const getDueColor = (status) => {
    switch (status) {
      case "Due":
        return theme.palette.error.main;
      case "Soon":
        return theme.palette.warning.main;
      case "Later":
        return theme.palette.success.main;
      default:
        return theme.palette.text.secondary;
    }
  };

  if (safeDecks.length === 0) {
    return <EmptyDeckState onCreateDeckClick={onCreateDeckClick} />;
  }

  return (
    <Grid container spacing={3}>
      {safeDecks.map((deck) => {
        const dueStatus = getDueStatus(deck);
        return (
          <Grid item xs={12} sm={6} md={4} key={deck.id}>
            <DeckCard
              deck={deck}
              dueStatus={dueStatus}
              dueColor={getDueColor(dueStatus)}
              onClick={() => onDeckClick(deck.id)}
            />
          </Grid>
        );
      })}
    </Grid>
  );
};

const DeckCard = ({ deck, dueStatus, dueColor, onClick }) => {
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
      <CardActionArea
        onClick={onClick}
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
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
            <Chip
              label={dueStatus}
              size="small"
              sx={{
                bgcolor: "background.paper",
                color: dueColor,
                fontWeight: 600,
                border: 1,
                borderColor: dueColor,
              }}
            />
          </Box>
        </CardContent>
      </CardActionArea>
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
