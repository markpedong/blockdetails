import { Exchange, getExchanges } from '@/api';
import { PRO_TABLE_PROPS } from '@/constants';
import { ProColumns, ProTable } from '@ant-design/pro-components';
import { Typography } from 'antd';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Exchanges: React.FC = () => {
	const [exchanges, setExchanges] = useState<Exchange[]>([]);
	const [page, setPage] = useState<number>(1);
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
				console.log(record);
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

	const getTableData = async (page: number) => {
		try {
			const data = await getExchanges({ page, per_page: 250 });

			if (data.status !== 200) {
				throw new Error('Failed to fetch exchanges');
			}

			if (data.data.length === 0) {
				return;
			}

			setExchanges(prevExchanges => [...prevExchanges, ...data.data]);

			setPage(prevPage => prevPage + 1);
		} catch {}
	};

	useEffect(() => {
		getTableData(page);
	}, [page]);

	return (
		<ProTable<Exchange> {...PRO_TABLE_PROPS} rowKey="id" dataSource={exchanges} search={false} columns={columns} />
	);
};

export default Exchanges;
