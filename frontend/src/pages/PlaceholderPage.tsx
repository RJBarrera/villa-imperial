import type { ReactNode } from "react";

import { Box, Card, CardContent, Typography } from "@mui/material";

interface PlaceholderPageProps {
  title: string;
  description: string;
  icon?: ReactNode;
}

export default function PlaceholderPage({
  title,
  description,
  icon,
}: PlaceholderPageProps) {
  return (
    <Box>
      <Typography
        sx={{
          fontSize: {
            xs: 24,
            md: 28,
          },

          fontWeight: 700,
        }}
      >
        {title}
      </Typography>

      <Typography
        sx={{
          mt: 0.7,
          fontSize: 13,
          color: "text.secondary",
        }}
      >
        {description}
      </Typography>

      <Card
        sx={{
          mt: 3,
        }}
      >
        <CardContent
          sx={{
            py: 8,
            textAlign: "center",
          }}
        >
          {icon && (
            <Box
              sx={{
                color: "primary.main",

                "& svg": {
                  fontSize: 52,
                },
              }}
            >
              {icon}
            </Box>
          )}

          <Typography
            sx={{
              mt: 1.5,
              fontWeight: 700,
              fontSize: 17,
            }}
          >
            {title}
          </Typography>

          <Typography
            sx={{
              mt: 0.7,
              maxWidth: 480,
              mx: "auto",
              fontSize: 12,
              color: "text.secondary",
            }}
          >
            Este módulo ya está integrado en la navegación y será desarrollado
            en las próximas fases.
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
