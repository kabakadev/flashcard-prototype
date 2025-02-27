"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  IconButton,
  Tooltip,
} from "@mui/material";
import { motion } from "framer-motion";
import { Pencil, Trash2, Repeat } from "lucide-react";

const FlashcardItem = ({ flashcard, onEdit, onDelete }) => {
  const [previewSide, setPreviewSide] = useState("front");

  const toggleCardSide = () => {
    setPreviewSide(previewSide === "front" ? "back" : "front");
  };

  return (
    <motion.div whileHover={{ y: -5, transition: { duration: 0.2 } }}>
      <Card
        sx={{
          borderRadius: 3,
          boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          transition: "all 0.3s ease",
          "&:hover": {
            boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
          },
        }}
      >
        <CardContent
          sx={{
            p: 0,
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Box
            sx={{
              p: 3,
              borderBottom: 1,
              borderColor: "divider",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  color: "text.secondary",
                  bgcolor: "background.default",
                  px: 1,
                  py: 0.5,
                  borderRadius: 1,
                }}
              >
                {previewSide === "front" ? "Question" : "Answer"}
              </Typography>
              <Tooltip title="Flip card">
                <IconButton
                  size="small"
                  onClick={toggleCardSide}
                  sx={{
                    color: "primary.main",
                    "&:hover": {
                      bgcolor: "primary.main",
                      color: "primary.contrastText",
                    },
                  }}
                >
                  <Repeat size={16} />
                </IconButton>
              </Tooltip>
            </Box>
            <Typography
              variant="body1"
              sx={{
                color: "text.primary",
                minHeight: "80px",
                display: "flex",
                alignItems: "center",
              }}
            >
              {previewSide === "front"
                ? flashcard.front_text
                : flashcard.back_text}
            </Typography>
          </Box>
          <Box
            sx={{
              p: 2,
              borderTop: 1,
              borderColor: "divider",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box>
              <Tooltip title="Edit flashcard">
                <IconButton
                  size="small"
                  onClick={() => onEdit(flashcard)}
                  sx={{
                    mr: 1,
                    color: "text.secondary",
                    "&:hover": { color: "primary.main" },
                  }}
                >
                  <Pencil size={18} />
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete flashcard">
                <IconButton
                  size="small"
                  onClick={() => onDelete(flashcard.id)}
                  sx={{
                    color: "error.main",
                    "&:hover": { color: "error.dark" },
                  }}
                >
                  <Trash2 size={18} />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default FlashcardItem;
