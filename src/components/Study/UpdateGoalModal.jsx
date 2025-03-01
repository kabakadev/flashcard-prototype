import {
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  Modal,
} from "@mui/material";

const UpdateGoalModal = ({
  open,
  onClose,
  weeklyGoal,
  setWeeklyGoal,
  onSave,
  error,
  setError,
}) => {
  return (
    <Modal open={open} onClose={onClose} aria-labelledby="update-goal-title">
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
          id="update-goal-title"
          sx={{ mb: 3, fontWeight: "bold" }}
        >
          Update Weekly Goal
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError("")}>
            {error}
          </Alert>
        )}

        <TextField
          label="New Weekly Goal"
          type="number"
          value={weeklyGoal}
          onChange={(e) => setWeeklyGoal(Math.max(1, Number(e.target.value)))}
          fullWidth
          required
          error={weeklyGoal < 1}
          helperText={weeklyGoal < 1 && "Weekly goal must be at least 1"}
          sx={{ mb: 3 }}
        />

        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            variant="contained"
            onClick={onSave}
            sx={{
              flex: 1,
              bgcolor: "primary.main",
              color: "primary.contrastText",
              "&:hover": {
                bgcolor: "primary.dark",
              },
            }}
          >
            Save Changes
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
    </Modal>
  );
};

export default UpdateGoalModal;
