import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';
import type { NextApiRequest, NextApiResponse } from 'next';
 
export default async function handler(
	request: NextApiRequest,
	response: NextApiResponse,
) {
	const body = request.body;
 
	try {
		const jsonResponse = await handleUpload({
			body,
			request,
			onBeforeGenerateToken: async (
				pathname: string,
				/* clientPayload?: string, */
			) => {
				return {
					allowedContentTypes: ['image/jpeg', 'image/png', 'image/gif']
				};
			},
			onUploadCompleted: async ({ blob, tokenPayload }) => {
				// Get notified of client upload completion
				// ⚠️ This will not work on `localhost` websites,
				// Use ngrok or similar to get the full upload flow
 
				console.log('blob upload completed', blob, tokenPayload);
			},
		});
 
		return response.status(200).json(jsonResponse);
	} catch (error) {
		// The webhook will retry 5 times waiting for a 200
		return response.status(400).json({ error: (error as Error).message });
	}
}