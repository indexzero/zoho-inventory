# zoho-inventory

Fetch-based API client for the Zoho Inventory API 

## Usage

## API Coverage

> Source: [Zoho Inventory API Docs]

- [Items, Custom Field, Organization, Composite Items]
- [Resources not yet implemented]

### Items, Item Groups, Composite Items 

| Resource       | Action         |    |
| -------------- | -------------- | -- |
| Item           | List           | ✅ |
| Item           | Create         | ✅ |
| Item           | Create (Image) | ✅ |
| Item           | Read           | ✅ |
| Item           | Update         | ⚠️ |
| Item           | Delete         | ✅ |
| Item           | Delete Image   | ❌ |
| Item           | Mark Active    | ❌ |
| Item           | Mark Inactive  | ❌ |
| Custom Field   | List           | ✅ |
| Custom Field   | Create         | ✅ |
| Custom Field   | Read           | ⚠️ |
| Custom Field   | Update         | ⚠️ |
| Custom Field   | Delete         | ✅ |
| Organization   | List           | ❌ |
| Organization   | Create         | ❌ |
| Organization   | Read           | ❌ |
| Organization   | Update         | ❌ |
| Organization   | Delete         | ❌ |
| Composite Item | List           | ❌ |
| Composite Item | Create         | ❌ |
| Composite Item | Read           | ❌ |
| Composite Item | Update         | ❌ |
| Composite Item | Delete         | ❌ |
| Composite Item | Mark Active    | ❌ |
| Composite Item | Mark Inactive  | ❌ |

#### Legend

- ✅: Implemented with E2E Test Coverage.
- ⚠️: Implemented with **no test coverage.**
- ❌: Not implemented yet.

### Resources not yet implemented

- Contacts, Contact Persons, Users
- Item Group, Item Adjustments
- Transfer Orders, Sales Orders, Invoices
- Purchase Orders, Purchase Receives
- Bills, Customer Payments
- Shipment Orders, Packages
- Taxes, Currency

[Zoho Inventory API Docs]: https://www.zoho.com/inventory/api/v1/
