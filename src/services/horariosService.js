import { format } from '@formkit/tempo'
import axios from 'axios'

export const getHorarios = async (fecha, idEvento) => {
	const fechaFormateada = format(fecha, 'YYYY-MM-DD')
	const res = await axios.get(
		`/horarios?idevento=${idEvento}&fecha=${fechaFormateada}`
	)
	return res.data
}
