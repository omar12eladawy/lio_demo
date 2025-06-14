export interface OrderLine {
    description: string;
    unit_price: number;
    amount: number;
    unit: string;
    total_price: number;
}

export interface ProcurementRequest {
    _id?: string;
    requestor_name: string;
    title: string;
    vendor_name: string;
    vat_id: string;
    commodity_group: string;
    order_lines: OrderLine[];
    total_cost: number;
    department: string;
    status: 'OPEN' | 'IN_PROGRESS' | 'CLOSED';
    created_at: string;
    updated_at: string;
}

export interface DocumentProcessingResult {
    vendor_name: string;
    vat_id: string;
    department: string;
    order_lines: OrderLine[];
    total_cost: number;
} 