import './App.css'
import React, { useState, useEffect } from 'react'
import {
	DataGrid,
	gridPageCountSelector,
	gridPageSelector,
	useGridApiContext,
	useGridSelector,
} from '@mui/x-data-grid'
import axios from 'axios'
import {
	Box,
	Chip,
	Dialog,
	DialogContent,
	DialogTitle,
	IconButton,
	Pagination,
	PaginationItem,
	styled,
	Typography,
	Paper,
	Grid,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'

const Item = styled(Paper)(({ theme }) => ({
	backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
	...theme.typography.body2,
	padding: theme.spacing(1),
	textAlign: 'center',
	color: theme.palette.text.secondary,
}))

function App() {
	const [row, setRow] = useState([])
	const [data, setData] = useState(null)
	const [open, setOpen] = React.useState(false)

	const handleClickOpen = (data) => {
		setOpen(true)
		row.map((item) => {
			if (item.id === data.id) {
				setData(data)
			}
			return item
		})
	}

	const handleClose = (data) => {
		setOpen(false)
	}

	function CustomDialogue(params) {
		const { data } = params

		return (
			data && (
				<Dialog
					onClose={() => handleClose(data)}
					aria-labelledby='customized-dialog-title'
					open={open}>
					<DialogTitle sx={{ m: 0, p: 2 }} id='customized-dialog-title'>
						{data.company.name}
						{handleClose ? (
							<IconButton
								aria-label='close'
								onClick={handleClose}
								sx={{
									position: 'absolute',
									right: 8,
									top: 8,
									color: (theme) => theme.palette.grey[500],
								}}>
								<CloseIcon />
							</IconButton>
						) : null}
					</DialogTitle>
					<DialogContent dividers>
						<Typography>
							<b>Description:</b>
							{data.company.catchPhrase + ' ' + data.company.bs}
						</Typography>
						<br />
						<Grid container spacing={2}>
							<Grid item xs={6}>
								<b>Contact Person</b>
								<br />
								{data.name}
							</Grid>
							<Grid item xs={6}>
								<b>Address</b>
								<br />
								{data.address.suite +
									' ' +
									data.address.street +
									' ' +
									data.address.city +
									' ' +
									data.address.zipcode}
							</Grid>
							<Grid item xs={6}>
								<b>User Name</b>
								<br />
								{data.username}
							</Grid>
							<Grid item xs={6}>
								<b>Suite</b>
								<br />
								{data.address.suite}
							</Grid>
							<Grid item xs={6}>
								<b>Email</b>
								<br />
								{data.email}
							</Grid>
							<Grid item xs={6}>
								<b>Street</b>
								<br />
								{data.address.street}
							</Grid>
							<Grid item xs={6}>
								<b>Phone</b>
								<br />
								{data.phone}
							</Grid>
							<Grid item xs={6}>
								<b>City</b>
								<br />
								{data.address.city}
							</Grid>
						</Grid>
					</DialogContent>
				</Dialog>
			)
		)
	}

	const columns = [
		{ field: 'companyName', headerName: 'Company Name', width: 200 },
		{ field: 'contact', headerName: 'Contact', width: 200 },
		{ field: 'city', headerName: 'Street', width: 200 },
		{ field: 'state', headerName: 'City', width: 200 },
		{
			field: 'row',
			headerName: '',
			renderCell: (params) => {
				return (
					<div>
						<Chip
							variant='filled'
							color='error'
							onClick={() => handleClickOpen(params.row)}
							label='View More'
						/>
						{open && <CustomDialogue data={data} />}
					</div>
				)
			},
		},
	]

	useEffect(() => {
		axios.get('https://jsonplaceholder.typicode.com/users').then((res) => {
			res.data.map((item) => {
				item.companyName = item.company.name
				item.contact = item.name
				item.city = item.address.street
				item.state = item.address.city
				return item
			})
			setRow(res.data)
		})
	}, [])

	const CustomPagination = () => {
		const apiRef = useGridApiContext()
		const page = useGridSelector(apiRef, gridPageSelector)
		const pageCount = useGridSelector(apiRef, gridPageCountSelector)

		return (
			<Pagination
				color='primary'
				variant='outlined'
				shape='rounded'
				page={page + 1}
				count={pageCount}
				renderItem={(props2) => <PaginationItem {...props2} disableRipple />}
				onChange={(event, value) => apiRef.current.setPage(value - 1)}
			/>
		)
	}
	return (
		<Box
			sx={{
				height: 1,
				width: '100%',
				justifyContent: 'center',
				alignItems: 'center',
				display: 'flex',
			}}>
			<Box
				sx={{ height: 1, m: 2, width: '70%', margin: '1.5rem' }}
				style={{ background: 'white' }}>
				<DataGrid
					sx={{
						'& .MuiDataGrid-cell': {
							fontFamily: 'Montserrat, sans-serif',
						},
						'& .MuiDataGrid-columnHeaderTitle': {
							textOverflow: 'clip',
							whiteSpace: 'break-spaces',
							height: 'auto',
							lineHeight: 1,
							fontFamily: 'Montserrat, sans-serif',
							fontWeight: '700',
						},
					}}
					columns={columns}
					rows={row}
					components={{
						Pagination: CustomPagination,
					}}
					autoHeight={true}
					pageSize={3}
					isRowSelectable={() => {
						return false
					}}
				/>
			</Box>
		</Box>
	)
}

export default App
