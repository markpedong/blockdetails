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
	tagTypes: ['globalData'],
	endpoints: builder => ({
		getGlobalData: builder.query({
			query: ({ convert }) => `/v1/global-metrics/quotes/latest?convert=${convert}`,
			providesTags: ['globalData']
		})
	})
})

export const { useGetGlobalDataQuery } = globalSliceTest
