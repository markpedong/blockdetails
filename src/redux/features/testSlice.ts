import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const globalSliceTest = createApi({
	reducerPath: 'globalSliceTest',
	baseQuery: fetchBaseQuery({
		baseUrl: process.env.NEXT_PUBLIC_HOST_CMC_PROD,
		// next: { revalidate: 10000 },
		headers: {
			'X-CMC_PRO_API_KEY': process.env.NEXT_PUBLIC_API_KEY_PROD
		}
	}),
	endpoints: builder => ({
		getGlobalData: builder.query({
			query: () => '/v1/global-metrics/quotes/latest'
		})
	})
})

export const { useGetGlobalDataQuery } = globalSliceTest
