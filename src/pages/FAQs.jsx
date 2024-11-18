import React, { useContext } from "react";
import {
  Box,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useNavigate } from "react-router-dom";
import { LanguageContext } from "../helpers/LanguageContext";

const FAQs = () => {
  const navigate = useNavigate();
  const { language } = useContext(LanguageContext);

  return (
    <Box>
      <AppBar position="static" color="default">
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={() => navigate(-1)}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6">{language.faqs.title}</Typography>
        </Toolbar>
      </AppBar>
      <Box sx={{ padding: 2 }}>
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>{language.faqs.question1}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>{language.faqs.answer1}</Typography>
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>{language.faqs.question2}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>{language.faqs.answer2}</Typography>
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>{language.faqs.question3}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>{language.faqs.answer3}</Typography>
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>{language.faqs.question4}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>{language.faqs.answer4}</Typography>
          </AccordionDetails>
        </Accordion>
      </Box>
    </Box>
  );
};

export default FAQs;
