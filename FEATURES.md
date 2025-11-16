# Feature Documentation

## Overview

The JS Labs Geld Calculator is a comprehensive South African contractor take-home pay calculator with advanced features for tax planning, scenario comparison, and financial analysis.

## Core Features

### 1. Tax Calculations
- **SARS 2025/26 Tax Brackets**: Accurate tax calculations using official SARS tax brackets
- **Automatic Calculations**: Real-time updates as you change inputs
- **Tax Breakdown**: Detailed view of tax calculations by bracket
- **Effective Tax Rate**: Clear display of your actual tax burden

### 2. Income & Deductions

#### Basic Inputs
- **Gross Income**: Monthly income with USD to ZAR conversion
- **Retirement Contributions**: Automatic validation against SARS limits (27.5% or R350k/year)
- **Medical Tax Credits**: Calculated based on number of beneficiaries
- **Home Office Deductions**: Proportional rent and utilities based on office space
- **Internet**: Fully deductible for contractors
- **PBO Donations**: Tax-deductible donations to Public Benefit Organizations

#### Business Expenses
- Add unlimited custom business expenses
- Common categories: software, professional fees, training, supplies
- Automatic deductibility calculations

#### Depreciation
- Track wear-and-tear depreciation for business assets
- Support for computers, furniture, software, etc.
- Monthly depreciation calculations

### 3. Advanced Features

#### Calculation Breakdown
- Step-by-step tax calculation display
- Visual breakdown of all deductions
- Tax bracket analysis
- Transparent calculations for better understanding

#### Scenario Comparison
- **Save Multiple Scenarios**: Create and save different income/expense scenarios
- **Compare Side-by-Side**: View multiple scenarios to make informed decisions
- **Scenario Management**: Edit names, load, delete scenarios
- **Persistent Storage**: All scenarios saved to browser local storage

#### VAT Management
- **VAT Registration Toggle**: Enable/disable VAT calculations
- **Configurable VAT Rate**: Default 15%, customizable
- **Output VAT**: Calculated on income
- **Input VAT**: Calculated on business expenses
- **Net VAT Payable**: Clear indication of amount owed to or refunded by SARS
- **Filing Information**: Helpful reminders about VAT filing requirements

#### Provisional Tax
- **Automatic Calculation**: First, second, and third provisional tax payments
- **Payment Schedule**: Due dates for each payment
- **Tax Year Display**: Shows current South African tax year
- **Filing Guidance**: Information on who must pay and how to pay
- **Penalty Information**: Warnings about late payment penalties

### 4. Currency & Exchange Rates

#### Live Exchange Rates
- **Auto-Update**: Fetches USD to ZAR rates from live API
- **Caching**: 1-hour cache to reduce API calls
- **Fallback**: Default rate if API unavailable
- **Manual Refresh**: Update rates on demand
- **Status Display**: Shows rate source (live/cached/default)

#### Multi-Currency Input
- Input values in ZAR or USD
- Automatic conversion to ZAR for calculations
- Real-time conversion display

### 5. Data Management

#### Auto-Save
- **Persistent Storage**: All inputs automatically saved to browser localStorage
- **Session Recovery**: Resume where you left off
- **No Account Required**: Privacy-focused local storage

#### Export Options
- **Excel Export**: Full data export with multiple sheets
  - Summary sheet with all inputs and calculations
  - Other Expenses breakdown
  - Depreciation breakdown
- **PDF Export**: Professional summary report
  - Clean, printable format
  - All key metrics and calculations
  - Perfect for tax filing or accountant review

### 6. User Experience

#### Guided Tour
- **First-Time Help**: Interactive tour for new users
- **Feature Overview**: Quick introduction to all sections
- **Restartable**: Access tour anytime from the bottom-left corner

#### Keyboard Shortcuts
- **Navigation**: Number keys (1-5) to switch between tabs
- **Quick Actions**:
  - `Ctrl+S`: Save current scenario
  - `Ctrl+K`: Clear all inputs
  - `Ctrl+E`: Export to Excel
  - `Ctrl+P`: Export to PDF
  - `Ctrl+B`: Toggle calculation breakdown
  - `?`: Show keyboard shortcuts help
- **Efficient Workflow**: Navigate without mouse

#### Responsive Design
- **Mobile-Optimized**: Full functionality on mobile devices
- **Swipe Gestures**: Swipe between tabs on touch devices
- **Adaptive Layout**: Optimized for all screen sizes
- **Dark Mode**: System-aware theme switching

#### Warnings & Validation
- **Smart Validation**: Real-time warnings for invalid inputs
- **Limit Alerts**: Notifications when exceeding SARS limits
- **Helpful Info**: Contextual information about tax rules
- **Error Prevention**: Catches common mistakes before they affect calculations

### 7. Settings & Preferences

#### Display Modes
- **Input Mode**: Toggle between monthly and annual values
- **Calculation Breakdown**: Show/hide detailed calculations
- **Flexible Views**: Customize what you see

#### Exchange Rate Management
- View current rate and update time
- Refresh rates manually
- See rate source (API/cached/default)

## Navigation

### Main Tabs
1. **Dashboard**: Overview of all key metrics with charts
2. **Basic Inputs**: Income and primary deductions
3. **Expenses**: Other business expenses
4. **Depreciation**: Asset depreciation tracking
5. **Breakdown**: Detailed calculation steps
6. **Scenarios**: Save and compare different scenarios
7. **VAT**: VAT registration and calculations
8. **Prov. Tax**: Provisional tax payment schedule
9. **Export**: Download Excel or PDF reports
10. **Settings**: Preferences and exchange rates

## Tax Compliance

### SARS 2025/26 Compliance
- Tax brackets accurately reflect SARS official rates
- Medical tax credits per SARS schedule
- Retirement contribution limits properly enforced
- PBO donation limits validated
- Home office deduction rules applied

### Important Notes
- Calculator provides estimates - consult a tax professional for official advice
- SARS rules may change - verify current regulations
- Keep documentation for all deductions claimed
- Provisional tax deadlines must be met to avoid penalties

## Data Privacy

- **Local Storage Only**: All data stored in your browser
- **No Server Uploads**: Nothing sent to external servers (except exchange rate API)
- **No Accounts**: No registration or personal information required
- **Your Control**: Clear all data anytime with one click

## Browser Compatibility

- Modern browsers (Chrome, Firefox, Safari, Edge)
- JavaScript must be enabled
- LocalStorage required for data persistence
- Responsive on all device sizes

## Getting Help

### In-App Help
- Tooltips on all input fields (hover over ⓘ icons)
- AI Chat assistant (simulated - click chat button)
- Guided tour (restart anytime)
- Keyboard shortcuts dialog

### External Resources
- [SARS Official Website](https://www.sars.gov.za)
- [SARS Tax Tables](https://www.sars.gov.za/tax-rates/)
- GitHub Issues for bug reports

## Future Enhancements

Planned features:
- Real AI integration for tax advice
- Historical tax rate comparisons
- Integration with accounting software
- Team/multi-user scenarios
- Advanced reporting options
- Tax planning recommendations
