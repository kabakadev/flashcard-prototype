import { Box, Button, IconButton, Tooltip } from "@mui/material";
import {
  ArrowLeft,
  Rotate3D,
  ThumbsUp,
  ThumbsDown,
  Trophy,
} from "lucide-react";

const StudyActions = ({
  showAnswer,
  setShowAnswer,
  currentFlashcardIndex,
  flashcardsLength,
  setCurrentFlashcardIndex,
  startTimeRef,
  handleFlashcardResponse,
  cardProgress,
  handleMarkAsLearned,
}) => {
  return (
    <Box sx={{ mt: 4, display: "flex", justifyContent: "center", gap: 2 }}>
      {/* Navigation Buttons */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
          mb: 2,
        }}
      >
        <Tooltip title="Previous Card (Left Arrow)">
          <span>
            <IconButton
              onClick={() => {
                if (currentFlashcardIndex > 0) {
                  setCurrentFlashcardIndex(currentFlashcardIndex - 1);
                  setShowAnswer(false);
                  startTimeRef.current = Date.now();
                }
              }}
              disabled={currentFlashcardIndex === 0}
              sx={{
                bgcolor: "background.paper",
                boxShadow: 1,
                "&:hover": { bgcolor: "action.hover" },
                "&.Mui-disabled": { opacity: 0.5 },
              }}
            >
              <ArrowLeft size={24} />
            </IconButton>
          </span>
        </Tooltip>

        {/* Mark as Learned Button */}
        <Tooltip
          title={
            cardProgress.is_learned ? "Already Learned" : "Mark as Learned"
          }
        >
          <span>
            <Button
              variant="outlined"
              color={cardProgress.is_learned ? "success" : "primary"}
              onClick={handleMarkAsLearned}
              startIcon={<Trophy size={20} />}
              disabled={cardProgress.is_learned}
              sx={{ px: 2 }}
            >
              {cardProgress.is_learned ? "Learned" : "Mark as Learned"}
            </Button>
          </span>
        </Tooltip>

        <Tooltip title="Next Card (Right Arrow)">
          <span>
            <IconButton
              onClick={() => {
                if (currentFlashcardIndex < flashcardsLength - 1) {
                  setCurrentFlashcardIndex(currentFlashcardIndex + 1);
                  setShowAnswer(false);
                  startTimeRef.current = Date.now();
                }
              }}
              disabled={currentFlashcardIndex === flashcardsLength - 1}
              sx={{
                bgcolor: "background.paper",
                boxShadow: 1,
                "&:hover": { bgcolor: "action.hover" },
                "&.Mui-disabled": { opacity: 0.5 },
              }}
            >
              <ArrowLeft size={24} style={{ transform: "rotate(180deg)" }} />
            </IconButton>
          </span>
        </Tooltip>
      </Box>

      {!showAnswer ? (
        <Button
          variant="contained"
          size="large"
          onClick={() => setShowAnswer(true)}
          startIcon={<Rotate3D size={20} />}
          sx={{
            minWidth: 200,
            py: 1.5,
          }}
        >
          Show Answer
        </Button>
      ) : (
        <>
          <Tooltip title="Press Left Arrow or 0">
            <Button
              variant="contained"
              size="large"
              color="error"
              onClick={() => handleFlashcardResponse(false)}
              startIcon={<ThumbsDown size={20} />}
              sx={{
                minWidth: 160,
                py: 1.5,
              }}
            >
              Incorrect
            </Button>
          </Tooltip>
          <Tooltip title="Press Right Arrow or 1">
            <Button
              variant="contained"
              size="large"
              color="success"
              onClick={() => handleFlashcardResponse(true)}
              startIcon={<ThumbsUp size={20} />}
              sx={{
                minWidth: 160,
                py: 1.5,
              }}
            >
              Correct
            </Button>
          </Tooltip>
        </>
      )}
    </Box>
  );
};

export default StudyActions;
