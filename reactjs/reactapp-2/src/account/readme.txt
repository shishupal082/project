dateSelection list recreate on
    - dateSelection click
    - userChange (As user change will load fresh data so all date range will be different)
        - All date range calculated from finalJournalData

Error component
    - Flush error on user change frop dropdown

Error available:
    - 1) Error in api (href)
    - 2) Invalid account name (text)
    - 3) Debit and Credit amount mismatch if both present (code)
    - 4) Unknown error

Page rendering cases handled
    - If page is disabled (metaData.disabledPages, Array)
        - It will not be displayed on home fields and dropDown fields
        - If we open disabled page
            - Heading = Page Not Found
            - Data = No Data Found template
        - If we click on Page Not Found tab (It will propagate smoothly)
    - If unknown page is open
        - Heading and Data will be same as disabled page
        - If we click on Page Not Found tab (It will not propagate, it will throw error Page 'noMatch' not found)

Page reload option added in
    - Journal
    - Journal by date
    - Current balance by date
    - Profit and loss
    - Customised debit account summary
    - Customised credit account summary
    - Customised account summary (In debit and credit only but not in customiseCalenderAccount)

Page reload option not available in
    - Account summary by calender
    - Account summary by account name
    - Account summary by date
    - Trial balance
    - Ledger
    - Current balance

2021-04-16
-----------------
remove folder accountv2 app
    - actually removed account app folder and rename accountv2 as account

