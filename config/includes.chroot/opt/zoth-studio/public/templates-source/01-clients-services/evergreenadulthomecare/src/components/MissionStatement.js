// components/MissionStatement.js
import React from 'react';
import MissionStatementDesktop from './desktop/MissionStatementDesktop';
import MissionStatementMobile from './mobile/MissionStatementMobile';
import { useMediaQuery, useTheme } from '@mui/material';

const MissionStatement = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));

  return isMobile ? <MissionStatementMobile /> : <MissionStatementDesktop />;
};

export default MissionStatement;
