import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ProcurementRequest, OrderLine } from '../../lib/types/procurement';
import { useState, useEffect } from 'react';

const orderLineSchema = z.object({
    description: z.string().min(1, 'Description is required'),
    unit_price: z.number().min(0, 'Unit price must be positive'),
    amount: z.number().min(0.01, 'Amount must be at least 0.01'),
    unit: z.string().min(1, 'Unit is required'),
    total_price: z.number().min(0, 'Total price must be positive'),
});

const requestSchema = z.object({
    requestor_name: z.string().min(1, 'Requestor name is required'),
    title: z.string().min(1, 'Title is required'),
    vendor_name: z.string().min(1, 'Vendor name is required'),
    vat_id: z.string().min(1, 'VAT ID is required'),
    commodity_group: z.string().min(1, 'Commodity group is required'),
    order_lines: z.array(orderLineSchema).min(1, 'At least one order line is required'),
    total_cost: z.number().min(0, 'Total cost must be positive'),
    department: z.string().min(1, 'Department is required'),
});

type RequestFormData = z.infer<typeof requestSchema>;

interface RequestFormProps {
    onSubmit: (data: RequestFormData) => Promise<void>;
    initialData?: Partial<ProcurementRequest>;
    isSubmitting?: boolean;
}

export function RequestForm({ onSubmit, initialData, isSubmitting = false }: RequestFormProps) {
    const [orderLines, setOrderLines] = useState<OrderLine[]>(
        initialData?.order_lines || [{ description: '', unit_price: 0, amount: 1, unit: '', total_price: 0 }]
    );

    const { register, handleSubmit, formState: { errors }, setValue, watch, getValues } = useForm<RequestFormData>({
        resolver: zodResolver(requestSchema),
        defaultValues: {
            requestor_name: initialData?.requestor_name || '',
            title: initialData?.title || '',
            vendor_name: initialData?.vendor_name || '',
            vat_id: initialData?.vat_id || '',
            commodity_group: initialData?.commodity_group || '',
            department: initialData?.department || '',
            total_cost: initialData?.total_cost || 0,
            order_lines: initialData?.order_lines || [{ description: '', unit_price: 0, amount: 1, unit: '', total_price: 0 }],
        },
    });

    // Update form when initialData changes (from document upload)
    useEffect(() => {
        if (initialData) {
            setValue('requestor_name', initialData.requestor_name || '');
            setValue('title', initialData.title || '');
            setValue('vendor_name', initialData.vendor_name || '');
            setValue('vat_id', initialData.vat_id || '');
            setValue('commodity_group', initialData.commodity_group || '');
            setValue('department', initialData.department || '');
            setValue('total_cost', initialData.total_cost || 0);
            
            if (initialData.order_lines && initialData.order_lines.length > 0) {
                setOrderLines(initialData.order_lines);
                setValue('order_lines', initialData.order_lines);
            }
        }
    }, [initialData, setValue]);

    const addOrderLine = () => {
        const newOrderLines = [...orderLines, { description: '', unit_price: 0, amount: 1, unit: '', total_price: 0 }];
        setOrderLines(newOrderLines);
        setValue('order_lines', newOrderLines);
    };

    const removeOrderLine = (index: number) => {
        const newOrderLines = orderLines.filter((_, i) => i !== index);
        setOrderLines(newOrderLines);
        setValue('order_lines', newOrderLines);
        
        // Update total cost
        const totalCost = newOrderLines.reduce((sum, line) => sum + line.total_price, 0);
        setValue('total_cost', totalCost);
    };

    const updateOrderLine = (index: number, field: keyof OrderLine, value: string | number) => {
        const newOrderLines = [...orderLines];
        newOrderLines[index] = { ...newOrderLines[index], [field]: value };
        
        // Calculate total price
        if (field === 'unit_price' || field === 'amount') {
            const unitPrice = field === 'unit_price' ? Number(value) : newOrderLines[index].unit_price;
            const amount = field === 'amount' ? Number(value) : newOrderLines[index].amount;
            newOrderLines[index].total_price = unitPrice * amount;
        }
        
        setOrderLines(newOrderLines);
        setValue('order_lines', newOrderLines);
        
        // Update total cost
        const totalCost = newOrderLines.reduce((sum, line) => sum + line.total_price, 0);
        setValue('total_cost', totalCost);
    };

    const onFormSubmit = async (data: RequestFormData) => {
        console.log('Form submitted with data:', data);
        console.log('Form errors:', errors);
        
        try {
            // Ensure order_lines are included
            const formData = {
                ...data,
                order_lines: orderLines,
                total_cost: orderLines.reduce((sum, line) => sum + line.total_price, 0)
            };
            
            console.log('Calling onSubmit with:', formData);
            await onSubmit(formData);
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
            {/* Debug info - remove in production */}
            {Object.keys(errors).length > 0 && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <h4 className="text-red-800 font-medium">Form Validation Errors:</h4>
                    <ul className="mt-2 text-sm text-red-700">
                        {Object.entries(errors).map(([key, error]) => (
                            <li key={key}>{key}: {error?.message}</li>
                        ))}
                    </ul>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Requestor Name</label>
                    <input
                        type="text"
                        {...register('requestor_name')}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                    {errors.requestor_name && (
                        <p className="mt-1 text-sm text-red-600">{errors.requestor_name.message}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Title</label>
                    <input
                        type="text"
                        {...register('title')}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                    {errors.title && (
                        <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Vendor Name</label>
                    <input
                        type="text"
                        {...register('vendor_name')}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                    {errors.vendor_name && (
                        <p className="mt-1 text-sm text-red-600">{errors.vendor_name.message}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">VAT ID</label>
                    <input
                        type="text"
                        {...register('vat_id')}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                    {errors.vat_id && (
                        <p className="mt-1 text-sm text-red-600">{errors.vat_id.message}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Department</label>
                    <input
                        type="text"
                        {...register('department')}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                    {errors.department && (
                        <p className="mt-1 text-sm text-red-600">{errors.department.message}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Commodity Group</label>
                    <input
                        type="text"
                        {...register('commodity_group')}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                    {errors.commodity_group && (
                        <p className="mt-1 text-sm text-red-600">{errors.commodity_group.message}</p>
                    )}
                </div>
            </div>

            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium text-gray-900">Order Lines</h3>
                    <button
                        type="button"
                        onClick={addOrderLine}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                    >
                        Add Order Line
                    </button>
                </div>

                {errors.order_lines && (
                    <p className="text-sm text-red-600">{errors.order_lines.message}</p>
                )}

                {orderLines.map((line, index) => (
                    <div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 border rounded-lg">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Description</label>
                            <input
                                type="text"
                                value={line.description}
                                onChange={(e) => updateOrderLine(index, 'description', e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Unit Price</label>
                            <input
                                type="number"
                                step="0.01"
                                value={line.unit_price}
                                onChange={(e) => updateOrderLine(index, 'unit_price', Number(e.target.value))}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Amount</label>
                            <input
                                type="number"
                                step="0.01"
                                value={line.amount}
                                onChange={(e) => updateOrderLine(index, 'amount', Number(e.target.value))}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                required
                                min="0.01"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Unit</label>
                            <input
                                type="text"
                                value={line.unit}
                                onChange={(e) => updateOrderLine(index, 'unit', e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                required
                            />
                        </div>

                        <div className="flex items-end space-x-2">
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700">Total Price</label>
                                <input
                                    type="number"
                                    value={line.total_price}
                                    readOnly
                                    className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm"
                                />
                            </div>
                            {orderLines.length > 1 && (
                                <button
                                    type="button"
                                    onClick={() => removeOrderLine(index)}
                                    className="inline-flex items-center p-2 border border-transparent text-sm font-medium rounded-md text-red-600 hover:bg-red-50"
                                >
                                    Remove
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Total Cost</label>
                <input
                    type="number"
                    {...register('total_cost')}
                    readOnly
                    className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm"
                />
            </div>

            <div className="flex justify-end">
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                    onClick={() => console.log('Submit button clicked')}
                >
                    {isSubmitting ? 'Submitting...' : 'Submit Request'}
                </button>
            </div>
        </form>
    );
} 