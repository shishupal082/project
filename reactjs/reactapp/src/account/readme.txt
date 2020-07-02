dateSelection list recreate on
    - dateSelection click
    - userChange (As user change will load fresh data so all date range will be different)
        - All date range calculated from finalJournalData

Error component
    - Flush error on user change

Error available:
    - 1) Error in api (href)
    - 2) Invalid account name (text)
    - 3) Debit and Credit amount mismatch if both present (code)
    - 4) Unknown error
