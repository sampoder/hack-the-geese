import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';
import type { NextApiRequest, NextApiResponse } from 'next';
 
export default async function handler(
	request: NextApiRequest,
	response: NextApiResponse,
) {
	const body = JSON.parse(request.body); 
	try {
		const jsonResponse = await handleUpload({
			body,
			request,
			onBeforeGenerateToken: async (
				pathname: string,
			) => {
				return {
					allowedContentTypes: ['image/jpeg', 'image/png', 'image/gif']
				};
			},
			onUploadCompleted: async ({ blob, tokenPayload }) => {
				console.log('blob upload completed', blob, tokenPayload);
			},
		});
		return response.status(200).json(jsonResponse);
	} catch (error) {
		console.error(error)
		return response.status(400).json({ error: (error as Error).message });
	}
}