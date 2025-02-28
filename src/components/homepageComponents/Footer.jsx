import {
  Box,
  Container,
  Grid,
  Typography,
  Button,
  Divider,
} from "@mui/material";

export default function Footer({ isDarkMode }) {
  const footerLinks = {
    Product: ["Features", "Pricing", "Testimonials", "FAQ"],
    Company: ["About", "Blog", "Careers", "Contact"],
    Legal: ["Terms", "Privacy", "Cookies", "Licenses"],
    Support: ["Help Center", "Community", "Resources", "Feedback"],
  };

  return (
    <Box
      component="footer"
      sx={{
        py: 6,
        bgcolor: isDarkMode ? "background.paper" : "background.nav",
        borderTop: 1,
        borderColor: "divider",
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Typography
              variant="h5"
              sx={{ mb: 2, fontWeight: "bold", color: "text.primary" }}
            >
              Flashlearn
            </Typography>
            <Typography variant="body2" sx={{ mb: 2, color: "text.secondary" }}>
              The smart way to learn anything. Create, study, and master any
              subject with our powerful flashcard platform.
            </Typography>
          </Grid>

          {Object.entries(footerLinks).map(([category, links]) => (
            <Grid item xs={12} md={2} key={category}>
              <Typography
                variant="subtitle1"
                sx={{ mb: 2, fontWeight: "bold", color: "text.primary" }}
              >
                {category}
              </Typography>
              <Box component="ul" sx={{ p: 0, m: 0, listStyle: "none" }}>
                {links.map((item) => (
                  <Box component="li" key={item} sx={{ mb: 1 }}>
                    <Button
                      variant="text"
                      sx={{
                        p: 0,
                        color: "text.secondary",
                        "&:hover": { color: "primary.main" },
                      }}
                    >
                      {item}
                    </Button>
                  </Box>
                ))}
              </Box>
            </Grid>
          ))}
        </Grid>
        <Divider sx={{ my: 4 }} />
        <Typography
          variant="body2"
          align="center"
          sx={{ color: "text.secondary" }}
        >
          © {new Date().getFullYear()} Flashlearn. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
}
