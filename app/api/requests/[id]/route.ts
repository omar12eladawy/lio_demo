import { NextResponse } from 'next/server';

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const response = await fetch(
            `http://localhost:8003/api/requests/${params.id}`,
            {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || 'Failed to delete request');
        }

        const result = await response.json();
        return NextResponse.json(result);
    } catch (error) {
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Failed to delete request' },
            { status: 500 }
        );
    }
} 