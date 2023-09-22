import { ExchangeDetail, getExchangesDetail, getExchangesPaprika } from '@/api'
import Detail from './components/detail'

const Exchanges = async ({ params }: { params: { id: string } }) => {
	const data = (await getExchangesDetail(params.id)) as unknown as ExchangeDetail
	const exchanges = await getExchangesPaprika()

	const filtered = exchanges?.filter(exchange => exchange.active === true && exchange.website_status === true)
	const pap = filtered?.find(paprika => paprika.id === params.id || paprika.name === data?.name)

	return <Detail exchange={data} pap={pap} id={params.id} />
}

export default Exchanges
