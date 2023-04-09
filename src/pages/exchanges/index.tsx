import { Exchange, getExchanges, getGlobalData } from '@/api';
import { PRO_TABLE_PROPS } from '@/constants';
import { ProColumns, ProTable } from '@ant-design/pro-components';
import { Typography } from 'antd';
import { FC } from 'react';
import { useNavigate } from 'react-router-dom';

let _exchange;

const Exchanges: FC = () => {
	const navigate = useNavigate();
	const columns: ProColumns<Exchange>[] = [
		{
			title: '#',
			align: 'right',
			render: (_, record) => record.trust_score_rank
		},
		{
			title: 'Name',
			align: 'left',
			render: (_, record) => {
				return (
					<div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
						<Typography.Link onClick={() => navigate(`/exchanges/${record.id}`)}>
							<img style={{ blockSize: '20px' }} src={record.image} />
						</Typography.Link>
						<Typography.Link onClick={() => navigate(`/exchanges/${record.id}`)}>
							{record.name}
						</Typography.Link>
					</div>
				);
			}
		}
	];

	const getAllData = async params => {
		const data = await getExchanges({
			per_page: params.pageSize,
			page: params.current
		});
		const global = await getGlobalData();

		_exchange = global.data.data.markets;

		return {
			data: data.data,
			total: Number(_exchange - 1) ?? 0
		};
	};

	return (
		<ProTable<Exchange>
			{...PRO_TABLE_PROPS}
			rowKey="id"
			//@ts-ignore
			request={getAllData}
			search={false}
			columns={columns}
		/>
	);
};

export default Exchanges;
