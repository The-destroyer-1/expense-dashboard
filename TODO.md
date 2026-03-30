# TODO: Implement Custom Date Selection for Reports

## Tasks
- [x] Update state in ReportsTab.tsx: Replace `timeframe` with `startDate` and `endDate`
- [x] Set default dates: startDate to first day of current month, endDate to today
- [x] Replace timeframe select dropdown with two date input fields
- [x] Modify `inTimeframe` function to filter based on date range instead of fixed periods
- [x] Test the changes to ensure reports generate correctly with custom dates

## Completed: Add Mileage In/Out Category to FundsTab

## Tasks
- [x] Update MileageEntry interface to include `type: 'in' | 'out'`
- [x] Add migration logic to set default type 'out' for existing entries
- [x] Update MileageForm type to include type field
- [x] Add type select dropdown to mileage form with "Mileage Out" and "Mileage In" options
- [x] Update form initialization and reset to include type field
- [x] Update handleMileageSubmit to include type in addMileage call
- [x] Add type select to MileageEntryItem editing mode
- [x] Fix all TypeScript errors related to the new type field
