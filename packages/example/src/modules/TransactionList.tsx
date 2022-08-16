import {
  Card,
  CardHeader,
  Link,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material'

const TransactionList = ({ list, explorer }) => {
  return (
    <Card variant={'outlined'}>
      <CardHeader title={'Transactions'} />
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Tx Hash</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {list.map(row => (
              <TableRow
                key={row.txHash}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {!explorer ? (
                    row.txHash
                  ) : (
                    <Link target="_blank" href={`${explorer}/tx/${row.txHash}`}>
                      {row.txHash}
                    </Link>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  )
}

export default TransactionList
