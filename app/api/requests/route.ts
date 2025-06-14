import { NextResponse } from 'next/server';
import { ProcurementRequest } from '@/lib/types/procurement';

export async function GET() {
    try {
        const response = await fetch('http://localhost:8003/api/requests');
        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to fetch requests' },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const data = await request.json();
        const response = await fetch('http://localhost:8003/api/requests', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error('Failed to create request');
        }

        const result = await response.json();
        return NextResponse.json(result);
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to create request' },
            { status: 500 }
        );
    }
} 