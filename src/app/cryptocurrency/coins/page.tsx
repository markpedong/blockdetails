import { getCryptocurrency } from '@/api'
import Table from './components/table/page'

const Coins = async () => {
	// LOCALSTORAGE???
	// const { symbol } = useAppSelector(state => state.setCurrency.value)
	const coins = await getCryptocurrency({
		aux: 'cmc_rank,circulating_supply',
		limit: 5000,
		convert: 'USD',
		cryptocurrency_type: 'coins'
	})

	return <Table data={coins.data} />
}

export default Coins
