import { coingeckoApiRoute } from '$lib/constants';
import { shapeQueryParams } from '$lib/utils/text-utils';

export async function queryCoingeckoApi<ResponseDataType = unknown>(
    apiKey: string,
    endpoint: string,
    queryParams: Record<string, string>
): Promise<ResponseDataType> {
    const queryParamsString = `x_cg_pro_api_key=${apiKey}&${shapeQueryParams(queryParams)}`;

    const response = await fetch(`${coingeckoApiRoute}${endpoint}?${queryParamsString}`);

    const data: ResponseDataType = await response.json();

    return data;
}
