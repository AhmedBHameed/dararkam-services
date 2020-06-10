import React from 'react';
import TableData from '../components/Table/Table';
import Container from '@material-ui/core/Container';
import useAllPrayersQuery from '../api/allPrayersQueryHook';
import useFridayInformationQuery from '../api/fridayInformationQueryHook';
import {lastFridayDate} from '../util/time';
import {makeStyles} from '@material-ui/core/styles';
import {Theme, Typography, Grid, Box} from '@material-ui/core';
import {red} from '@material-ui/core/colors';

const useStyles = makeStyles((theme: Theme) => ({
  spaceTop: {
    marginTop: theme.spacing(5),
  },
  dateColor: {
    color: red[400],
    fontWeight: 'bold',
  },
}));

const Home: React.FC = () => {
  const classes = useStyles();

  const allPrayers = useAllPrayersQuery();
  const fridayInformation = useFridayInformationQuery();

  const nextFridayDate = fridayInformation.data?.settings.nextFridayData;
  const {data} = allPrayers;

  return (
    <Container maxWidth="md" className={classes.spaceTop}>
      {nextFridayDate && (
        <Grid container direction="row" justify="space-between" alignItems="center">
          <Box>
            <Typography variant="h5" gutterBottom>
              House Al-Arkam
            </Typography>
          </Box>
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              From: <span className={classes.dateColor}>{lastFridayDate(nextFridayDate)}</span> ~> To:{' '}
              <span className={classes.dateColor}>{nextFridayDate}</span>
            </Typography>
          </Box>
        </Grid>
      )}
      {data && <TableData prayers={data} />}
    </Container>
  );
};

export default Home;
