import type { ReactNode } from "react";
import { Box, Card, CardContent, Stack, Typography } from "@mui/material";

interface StatCardProps {
  title: string;
  value: string;
  subtitle: string;
  icon: ReactNode;
  iconBackground: string;
  iconColor: string;
}

export default function StatCard({
  title,
  value,
  subtitle,
  icon,
  iconBackground,
  iconColor,
}: StatCardProps) {
  return (
    <Card
      sx={{
        height: "100%",
        transition: "transform .2s ease, box-shadow .2s ease",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: "0 10px 30px rgba(16,24,40,.08)",
        },
      }}
    >
      <CardContent
        sx={{
          p: 2.5,

          "&:last-child": {
            pb: 2.5,
          },
        }}
      >
        <Stack
          useFlexGap
          sx={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: 2,
          }}
        >
          <Box>
            <Typography
              sx={{
                fontSize: 13,
                color: "text.secondary",
                fontWeight: 500,
              }}
            >
              {title}
            </Typography>

            <Typography
              sx={{
                mt: 0.8,
                fontSize: {
                  xs: 24,
                  md: 27,
                },

                fontWeight: 700,
                color: "text.primary",
                lineHeight: 1.2,
              }}
            >
              {value}
            </Typography>

            <Typography
              sx={{
                mt: 0.8,
                fontSize: 11.5,
                color: "text.secondary",
              }}
            >
              {subtitle}
            </Typography>
          </Box>

          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: "14px",
              backgroundColor: iconBackground,
              color: iconColor,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              "& svg": {
                fontSize: 24,
              },
            }}
          >
            {icon}
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}
