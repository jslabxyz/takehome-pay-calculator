# JS Labs: Geld Calculator

A comprehensive South African contractor take-home pay calculator with advanced features for tax planning, scenario comparison, and financial analysis.

![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Next.js](https://img.shields.io/badge/Next.js-15-black.svg)
![React](https://img.shields.io/badge/React-18-blue.svg)

## Overview

The JS Labs Geld Calculator is a feature-rich web application designed specifically for South African contractors, freelancers, and self-employed professionals. It provides accurate tax calculations based on SARS 2025/26 tax brackets, with support for VAT, provisional tax, business expenses, and comprehensive scenario planning.

## Key Features

### 💰 **Accurate Tax Calculations**
- SARS 2025/26 tax brackets
- Medical tax credits
- Retirement contribution limits (27.5% cap)
- PBO donation deductions
- Effective tax rate analysis

### 🏢 **Business Expense Management**
- Home office deductions (rent, utilities)
- Internet expenses
- Custom business expenses
- Asset depreciation tracking
- Automatic SARS compliance validation

### 📊 **Advanced Features**
- **Calculation Breakdown**: Step-by-step tax calculation transparency
- **Scenario Comparison**: Save and compare multiple financial scenarios
- **VAT Management**: Full VAT registration and calculation support
- **Provisional Tax**: Automated payment schedule and amounts
- **Live Exchange Rates**: Real-time USD to ZAR conversion

### 💾 **Data Management**
- Auto-save to browser localStorage
- Export to Excel (multi-sheet workbook)
- Export to PDF (professional reports)
- Scenario persistence
- No account required - privacy-focused

### 🎯 **User Experience**
- Guided tour for first-time users
- Comprehensive keyboard shortcuts
- Mobile-optimized with swipe gestures
- Dark mode support
- Real-time validation and warnings
- Responsive design for all devices

## Tech Stack

### Core
- **Next.js 15** - React framework with App Router
- **React 18** - UI library
- **TypeScript 5** - Type safety
- **Tailwind CSS** - Styling
- **Zustand** - State management with persistence

### UI Components
- **Radix UI** - Accessible component library
- **Lucide React** - Icon system
- **Recharts** - Data visualization
- **Sonner** - Toast notifications

### Forms & Validation
- **React Hook Form** - Form management
- **Zod** - Schema validation
- Custom numeric input with currency formatting

### Export & Integration
- **xlsx** - Excel file generation
- **pdf-lib** - PDF document creation
- **Exchange Rate API** - Live currency conversion

### Development
- **Vitest** - Testing framework
- **TypeScript** - Type checking
- **ESLint** - Code quality

## Getting Started

### Prerequisites
- Node.js 18+ (recommended: 20+)
- pnpm, npm, or yarn

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/jslabxyz/takehome-pay-calculator.git
   cd takehome-pay-calculator
   ```

2. **Install dependencies**:
   ```bash
   pnpm install
   # or
   npm install
   # or
   yarn install
   ```

3. **Run the development server**:
   ```bash
   pnpm dev
   # or
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

### Building for Production

```bash
pnpm build
pnpm start
```

## Usage Guide

### Quick Start

1. **Enter Your Income**: Input your gross monthly income in the "Basic Inputs" tab
2. **Add Deductions**: Enter retirement contributions, medical beneficiaries, and home office details
3. **Review Dashboard**: See your take-home pay and tax breakdown
4. **Add Expenses**: Include other business expenses and depreciation
5. **Export**: Download your calculations as Excel or PDF

### Keyboard Shortcuts

- `1-5` / `1-0`: Navigate between tabs
- `Ctrl+S`: Save current scenario
- `Ctrl+K`: Clear all inputs
- `Ctrl+E`: Export to Excel
- `Ctrl+P`: Export to PDF
- `Ctrl+B`: Toggle calculation breakdown
- `?`: Show shortcuts help

### Tab Overview

1. **Dashboard**: Overview with charts and key metrics
2. **Basic Inputs**: Primary income and deduction inputs
3. **Expenses**: Other business expenses
4. **Depreciation**: Asset depreciation tracking
5. **Breakdown**: Detailed calculation steps
6. **Scenarios**: Save and compare multiple scenarios
7. **VAT**: VAT registration and calculations
8. **Prov. Tax**: Provisional tax payment schedule
9. **Export**: Download Excel/PDF reports
10. **Settings**: Preferences and exchange rate management

## Features in Detail

### Tax Calculations

The calculator implements SARS 2025/26 tax brackets:
- 0 - R237,100: 18%
- R237,101 - R370,500: 26%
- R370,501 - R512,800: 31%
- R512,801 - R673,000: 36%
- R673,001 - R857,900: 39%
- R857,901 - R1,817,000: 41%
- R1,817,001+: 45%

### Medical Tax Credits

- 1 beneficiary: R364/month
- 2 beneficiaries: R728/month
- 3+ beneficiaries: R728 + R246 × (beneficiaries - 2)

### Retirement Contributions

Deductible up to the lower of:
- 27.5% of gross income
- R350,000 per year (R29,166.67 per month)

### Home Office Deductions

Calculated proportionally based on office size:
- Rent: Deductible × (Office sqm / Total sqm)
- Utilities: Deductible × (Office sqm / Total sqm)
- Internet: 100% deductible

### VAT (Value Added Tax)

For VAT-registered contractors:
- **Output VAT**: 15% on income
- **Input VAT**: Claimable on business expenses
- **Net VAT**: Amount payable to or refundable by SARS
- Filing periods: Monthly (turnover > R30m) or bi-monthly

### Provisional Tax

Three payment schedule:
1. **First Payment**: 31 August (50% of estimated annual tax)
2. **Second Payment**: 28/29 February (remaining 50%)
3. **Third Payment**: 30 September (if shortfall exists)

Penalties apply for late payment (10% + interest).

## Development

### Project Structure

```
takehome-pay-calculator/
├── app/                    # Next.js app router
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   ├── calculator.tsx    # Main calculator
│   ├── dashboard.tsx     # Dashboard view
│   ├── input-form.tsx    # Basic inputs
│   ├── calculation-breakdown.tsx
│   ├── scenario-comparison.tsx
│   ├── vat-settings.tsx
│   ├── provisional-tax.tsx
│   └── ...
├── lib/                   # Utilities and logic
│   ├── store.ts          # Zustand store
│   ├── exchange-rate.ts  # Exchange rate service
│   └── utils.ts          # Helper functions
├── hooks/                 # Custom React hooks
│   ├── use-exchange-rate.ts
│   ├── use-keyboard-shortcuts.ts
│   └── ...
└── __tests__/            # Test files
```

### Available Scripts

```bash
pnpm dev        # Start development server
pnpm build      # Build for production
pnpm start      # Start production server
pnpm lint       # Run ESLint
pnpm test       # Run tests
```

### Adding Features

1. **New Component**: Create in `components/` directory
2. **State Management**: Add to `lib/store.ts`
3. **New Tab**: Update `components/calculator.tsx`
4. **Tests**: Add to `__tests__/` directory

### Testing

```bash
pnpm test              # Run all tests
pnpm test:watch        # Run tests in watch mode
pnpm test:ui           # Run tests with UI
```

## Configuration

### Exchange Rate API

The app uses [ExchangeRate-API](https://www.exchangerate-api.com/) for live USD to ZAR conversion. The free tier provides:
- 1,500 requests/month
- 1-hour caching (configurable)
- Automatic fallback to default rate

To use a different API, modify `lib/exchange-rate.ts`.

### Environment Variables

Create a `.env.local` file (optional):

```env
# Exchange Rate API (optional - uses public endpoint by default)
NEXT_PUBLIC_EXCHANGE_RATE_API_URL=https://api.exchangerate-api.com/v4/latest/USD

# Default exchange rate fallback
NEXT_PUBLIC_DEFAULT_EXCHANGE_RATE=18.5
```

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

Requires:
- JavaScript enabled
- LocalStorage available
- Modern CSS support

## Privacy & Security

- **Local Storage Only**: All data stored in browser localStorage
- **No Server Database**: No data sent to external servers (except exchange rate API)
- **No Tracking**: No analytics or user tracking
- **No Accounts**: No registration or personal information collected
- **Open Source**: Code is fully transparent and auditable

## Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Disclaimer

This calculator provides estimates based on SARS 2025/26 tax tables. It is not a substitute for professional tax advice. Always consult with a registered tax professional or accountant for official tax planning and filing.

## Support

- **Documentation**: See [FEATURES.md](FEATURES.md) for detailed feature documentation
- **Issues**: [GitHub Issues](https://github.com/jslabxyz/takehome-pay-calculator/issues)
- **SARS Website**: [www.sars.gov.za](https://www.sars.gov.za)

## Acknowledgments

- SARS for official tax tables and regulations
- Exchange Rate API for currency conversion
- Radix UI for accessible components
- Next.js team for the amazing framework
- All contributors and users

## Roadmap

### Planned Features
- ✅ Live exchange rates
- ✅ Scenario comparison
- ✅ VAT calculations
- ✅ Provisional tax
- ✅ Keyboard shortcuts
- ✅ Guided tour
- 🚧 Real AI integration for tax advice
- 📋 Historical tax rate comparisons
- 📋 Advanced reporting options
- 📋 Integration with accounting software
- 📋 Multi-year tax planning

---

**Made with ❤️ for South African contractors**
