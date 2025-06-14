import { NextResponse } from 'next/server';

export async function PATCH(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const data = await request.json();
        const response = await fetch(
            `http://localhost:8003/api/requests/${params.id}/status`,
            {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            }
        );

        if (!response.ok) {
            throw new Error('Failed to update status');
        }

        const result = await response.json();
        return NextResponse.json(result);
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to update status' },
            { status: 500 }
        );
    }
} 