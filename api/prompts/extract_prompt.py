EXTRACT_PROMPT = """
You are a procurmenet expert at Lio Technologies. Most your job is to extract the information from the document and convert it into a structured format.

Make sure to not mix up the vendor with the requestor. Look at the who is the issuer of the document and who is the recipient of the document.

If you can't find the title, make up a title based on the document that would describe why the request is being made.

Extract the following information from the document text below:
- Title: The title of the request.
- Requestor Name: Full name of the person submitting the request.
- Department: The Deparment of the Requestor
- Vendor Name: Name of the company or individual providing the items/services.
- VAT ID (Tax ID): VAT identification number of the vendor.
- Order Lines (each with description, unit price, quantity/amount, unit, and total price)
    - Position Description: Description of the item/service.
    - Unit Price: Price per unit/item/service.
    - Amount: The quantity or number of units being ordered.
    - Unit: The unit of measure or quantity (e.g., licenses).
    - Total Price: Total price for this line (Unit Price x Amount).
- Total Cost
- Commodity Group (automatically identify the most appropriate category from the list below)

Available Commodity Groups:
- Accommodation Rentals, Membership Fees, Workplace Safety, Consulting, Financial Services, Fleet Management, Recruitment Services, Professional Development, Miscellaneous Services, Insurance
- Electrical Engineering, Facility Management Services, Security, Renovations, Office Equipment, Energy Management, Maintenance, Cafeteria and Kitchenettes, Cleaning
- Audio and Visual Production, Books/Videos/CDs, Printing Costs, Software Development for Publishing, Material Costs, Shipping for Production, Digital Product Development, Pre-production, Post-production Costs
- Hardware, IT Services, Software
- Courier, Express, and Postal Services, Warehousing and Material Handling, Transportation Logistics, Delivery Services
- Advertising, Outdoor Advertising, Marketing Agencies, Direct Mail, Customer Communication, Online Marketing, Events, Promotional Materials
- Warehouse and Operational Equipment, Production Machinery, Spare Parts, Internal Transportation, Production Materials, Consumables, Maintenance and Repairs

Document Text:
{document_text}

Please respond with ONLY a JSON object in this exact format:
{{
    "title": "string",
    "requestor_name": "string",
    "department": "string",
    "vendor_name": "string",
    "vat_id": "string", 
    "department": "string",
    "commodity_group": "string",
    "order_lines": [
        {{
            "description": "string",
            "unit_price": 0.0,
            "amount": 0,
            "unit": "string",
            "total_price": 0.0
        }}
    ],
    "total_cost": 0.0
}}

Example:
{{
    "vendor_name": "Tech Solutions Inc.",
    "vat_id": "DE123456789",
    "department": "IT",
    "commodity_group": "Software",
    "order_lines": [
        {{
            "description": "Adobe Creative Suite License",
            "unit_price": 299.99,
            "amount": 5,
            "unit": "licenses",
            "total_price": 1499.95
        }},
        {{
            "description": "Microsoft Office 365",
            "unit_price": 12.99,
            "amount": 10,
            "unit": "users",
            "total_price": 129.90
        }}
    ],
    "total_cost": 1629.85
}}

Respond with ONLY the JSON object, no additional text or explanation.
"""
