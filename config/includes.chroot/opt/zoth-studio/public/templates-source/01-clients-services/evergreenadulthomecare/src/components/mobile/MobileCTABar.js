import { Email, Facebook, Phone, X } from "@mui/icons-material";
import { Box, Divider, Typography, IconButton } from "@mui/material";
import React from "react";

const MobileCTABar = () => {
    return (
        <Box
            sx={{
                bgcolor: "#f8f8f8",
                boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                padding: 3,
                display: "flex",
                flexDirection: "column",
                gap: 3,
                alignItems: "center",
                maxWidth: "100vw",
                margin: "auto",
            }}
        >
            {/* Contact Info */}
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "row",
                    gap: 2,
                    justifyContent: "center",
                    alignItems: "center",
                    width: "100%",
                }}
            >
                <Phone />
                <Typography
                    variant="body1"
                    sx={{  fontSize: "15px", fontWeight: "bold", color: "#333" }}
                >
                    951-893-0859
                </Typography>
                <Divider orientation="vertical" flexItem />
                <Email />
                <Typography
                    variant="body1"
                    sx={{ fontSize: "15px", fontWeight: "bold", color: "#333" }}
                >
                    support@evergreenhc.com
                </Typography>
            </Box>

            {/* Social Media Section */}
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 5,
                }}
            >
                <Typography
                    variant="subtitle1"
                    sx={{ color: "#777", marginBottom: 1 }}
                >
                    Follow us!
                </Typography>
                <Box sx={{ display: "flex", gap: 2 }}>
                    <IconButton
                        sx={{
                            bgcolor: "#4267B2",
                            color: "white",
                            "&:hover": { bgcolor: "#365899" },
                        }}
                    >
                        <Facebook />
                    </IconButton>
                    <IconButton
                        sx={{
                            bgcolor: "black",
                            color: "white",
                            "&:hover": { bgcolor: "#333" },
                        }}
                    >
                        <X />
                    </IconButton>
                </Box>
            </Box>
        </Box>
    );
};

export default MobileCTABar;
