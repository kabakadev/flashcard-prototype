"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import PropTypes from "prop-types"
import { Card, CardContent, Button, Typography } from "@mui/material"

export default function FlashCard({ question, answer }) {
  const [isFlipped, setIsFlipped] = useState(false)

  return (
    <div className="relative w-[282px] h-[248px] [perspective:1000px]">
      <motion.div
        className="w-full h-full relative [transform-style:preserve-3d] cursor-pointer"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
        whileHover={{ scale: 1.02 }}
      >
        {/* Front of card */}
        <Card
          sx={{
            position: "absolute",
            width: "100%",
            height: "100%",
            backfaceVisibility: "hidden",
            bgcolor: (theme) =>
              theme.palette.mode === "dark" ? theme.palette.background.paper : theme.palette.background.paper,
            color: (theme) => theme.palette.text.primary,
            transition: (theme) =>
              theme.transitions.create(["background-color", "color"], {
                duration: theme.transitions.duration.standard,
              }),
          }}
        >
          <CardContent
            sx={{
              height: "100%",
              p: 3,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <div>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Question:
              </Typography>
              <Typography variant="body1" sx={{ minHeight: "100px" }}>
                {question}
              </Typography>
            </div>
            <div className="flex gap-[19px]">
              <Button
                variant="contained"
                fullWidth
                onClick={() => setIsFlipped(true)}
                sx={{
                  bgcolor: (theme) =>
                    theme.palette.mode === "dark" ? theme.palette.primary.main : theme.palette.primary.main,
                  color: (theme) => theme.palette.primary.contrastText,
                  "&:hover": {
                    bgcolor: (theme) =>
                      theme.palette.mode === "dark" ? theme.palette.primary.dark : theme.palette.primary.light,
                  },
                }}
              >
                Flip
              </Button>
              <Button
                variant="contained"
                fullWidth
                sx={{
                  bgcolor: (theme) =>
                    theme.palette.mode === "dark" ? theme.palette.primary.main : theme.palette.primary.main,
                  color: (theme) => theme.palette.primary.contrastText,
                  "&:hover": {
                    bgcolor: (theme) =>
                      theme.palette.mode === "dark" ? theme.palette.primary.dark : theme.palette.primary.light,
                  },
                }}
              >
                Next
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Back of card */}
        <Card
          sx={{
            position: "absolute",
            width: "100%",
            height: "100%",
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            bgcolor: (theme) =>
              theme.palette.mode === "dark" ? theme.palette.background.paper : theme.palette.background.paper,
            color: (theme) => theme.palette.text.primary,
            transition: (theme) =>
              theme.transitions.create(["background-color", "color"], {
                duration: theme.transitions.duration.standard,
              }),
          }}
        >
          <CardContent
            sx={{
              height: "100%",
              p: 3,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <div>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Answer:
              </Typography>
              <Typography variant="body1" sx={{ minHeight: "100px" }}>
                {answer}
              </Typography>
            </div>
            <div className="flex gap-[19px]">
              <Button
                variant="contained"
                fullWidth
                onClick={() => setIsFlipped(false)}
                sx={{
                  bgcolor: (theme) =>
                    theme.palette.mode === "dark" ? theme.palette.primary.main : theme.palette.primary.main,
                  color: (theme) => theme.palette.primary.contrastText,
                  "&:hover": {
                    bgcolor: (theme) =>
                      theme.palette.mode === "dark" ? theme.palette.primary.dark : theme.palette.primary.light,
                  },
                }}
              >
                Flip
              </Button>
              <Button
                variant="contained"
                fullWidth
                sx={{
                  bgcolor: (theme) =>
                    theme.palette.mode === "dark" ? theme.palette.primary.main : theme.palette.primary.main,
                  color: (theme) => theme.palette.primary.contrastText,
                  "&:hover": {
                    bgcolor: (theme) =>
                      theme.palette.mode === "dark" ? theme.palette.primary.dark : theme.palette.primary.light,
                  },
                }}
              >
                Next
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

FlashCard.propTypes = {
  question: PropTypes.string.isRequired,
  answer: PropTypes.string.isRequired,
}

