import React from 'react';
import {withStyles, Theme, createStyles, makeStyles} from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import {PrayerModel} from '../../api/allPrayersQueryHook';
import {moment} from '../../util/time';

const StyledTableCell = withStyles((theme: Theme) =>
  createStyles({
    head: {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.common.white,
    },
    body: {
      fontSize: 14,
      paddingTop: theme.spacing(1),
      paddingBottom: theme.spacing(1),
    },
  })
)(TableCell);

const StyledTableRow = withStyles((theme: Theme) =>
  createStyles({
    root: {
      '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
      },
    },
  })
)(TableRow);

const useStyles = makeStyles((theme: Theme) => ({
  table: {
    minWidth: 700,
  },
  padded: {
    padding: theme.spacing(2),
  },
}));

interface TableDataProps {
  prayers: PrayerModel[];
}

const TableData: React.FC<TableDataProps> = ({prayers}) => {
  const classes = useStyles();

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell>First name</StyledTableCell>
            <StyledTableCell>Last name</StyledTableCell>
            <StyledTableCell align="right">Phone number</StyledTableCell>
            <StyledTableCell align="right">Pray at</StyledTableCell>
            <StyledTableCell align="right">Registered at</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {prayers.map((prayer, index) => (
            <StyledTableRow key={index.toString()}>
              {/* component="th" scope="row" */}
              <StyledTableCell>{prayer.name.first}</StyledTableCell>
              <StyledTableCell>{prayer.name.last}</StyledTableCell>
              <StyledTableCell align="right">{prayer.phone}</StyledTableCell>
              <StyledTableCell align="right">{prayer.reservePrayingTime}</StyledTableCell>
              <StyledTableCell align="right">{moment(prayer.updatedAt).format('YYYY-MM-DD (hh:mm a)')}</StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TableData;
