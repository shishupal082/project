1) Journal By Date
------------------
It will display how journal entry is made
	- No math calculation

*** End ***

2) Current Balance By Date
--------------------------
Account particular
If any confusion in "3) Customise Account Summary"
	- Same can be verified here

*** End ***

3) Customise Account Summary
----------------------------
Fully customizable
Configuration

"customeAccount": [
    {
        "customiseDebitAccount": [
            {
                "heading": "Expense source Debit",
                "accountNames": ["bank", "cash"]
            }
        ],
        "customiseCreditAccount": [
            {
                "heading": "Expense source Credit",
                "accountNames": ["bank", "cash"]
            }
        ],
        "customiseCalenderAccount": [
            {
                "heading": "Calender data",
                "accountNames": ["bank", "cash"]
            }
        ]
    },
    {

        "customiseCreditAccount": [
            {
                "heading": "Sales earning Credit",
                "accountNames": ["sales"]
            }
        ]
    },
    {
        "customiseDebitAccount": [
            {
                "heading": "Purchase expense Debit",
                "accountNames": ["purchase", "transport", "staff-expense"]
            },
            {
                "heading": "Other expense Debit",
                "accountNames": ["misc", "staff-salary"]
            }
        ]
    }
]

It will give complete details on month basis

- Source debit of expense (Assets debit: bank, cash); X
- Expense credit source (Assets credit: bank, cash); Y
- Variation of bank & cash; P,Q
    X = Y+P+Q

- It will give exact monthly earning and expense as per configuration
	- From earning and expense we can generate account statement
		- Sales (A)
		- Purchase (B)
		- Other expense (C)
			=> Gross earning = A-B-C


*** End ***

4) Account Summary By Calender
------------------------------
Subset of "3) Customise Account Summary"
i.e. This page can be achieved from "3) Customise Account Summary"

Display current position of particular account in the end of the month and how it has varies over the current year

It will help to find the trend of bussiness over the different months
- bussiness => Sales vary, Purchase vary, Transport allowance vary, Staff charge vary, Personel expense vary, Labour charges

*** End ***

5) Account Summary By A/C Name
------------------------------
*** End ***

6) Account Summary By Date
---------------------------
Similar to trial balance
	- It will also show account which has Debit = Credit
	- It will also show, current balance = Debit - Credit

*** End ***


7) Customised Debit Account Summary
-----------------------------------
Subset of "3) Customise Account Summary"
*** End ***

8) Customised Credit Account Summary
------------------------------------
Subset of "3) Customise Account Summary"
*** End ***

9) Trial Balance
----------------
If Debit == Credit, then it will not display on this page
For that we can check in 
	- Currentbal page or
	- Account summary by date

*** End ***

10) Ledger (No date filter)
---------------------------
*** End ***

11) Journal (No date filter)
----------------------------
Display journal the way it is loaded in api data
*** End ***

12) Current Balance (No date filter)
------------------------------------
*** End ***



Methods used in this application
--------------------------------
Accounting type (Traditional / old method)
    - Personal account
        - Natural account
        - Artificial personal account (Company)
        - Representative
            - Ex: Outstanding, prepaid, capital, drawing
                - Company, bank, person
    - Real account
        - Tangible real account (Which can be touch, building, pen, machinary)
        - Intangible (Goodwill, patent, copyright)
        - Cash, Goods
    - Nominal account
        - sales, purchase
        - Expense
        - Income

Rules of debit and credit
---------------------------
A/C            Debit               Credit
Personal       Receiver            Giver
Real           Comes in            Goes out
Nominal        All Expense/losses (Paid)  All income/gains(Received)

Real: Machine, Cash, Furniture

Nominal: Serices / Profit & Loss
    Rent, Loan interest
    1)
        Salary paid of rs 4000 cash
        Salary(N) Dr, Cash(R) Cr
    2)
        Fee received of Rs 4000 cash
        Fee(N) Cr, Cash(R) comes in, Dr

Personal
    1)
        Cash received from deepak
        Cash(R) Dr , Deepak(P) Cr
    2)
        Goods sold to ravi
        Goods(R) Cr, Ravi(P) Dr


Journal entry
-------------
1) Things
2) Service
3) Promise
4) Profit / Losses

Based on accounting equation C+L = A

Len(Debit)                  den (Credit)
*****************************************
Pen                         Cash
Computer                    Cash
Cash                        Bike
Electricity bill            Cash
Maid Wages                  Cash
Tution class                Cash

Pen                         Ravi stationer(Promise (Cash/Bank))
Ravi stationer              Cash

My friend                   Bike
Cash                        My friend

Cash 15k                    Bike 25k
My friend 10k
Cash 10k                    My friend 10k


Cash 50k                    Bank loan 50k
Bank loan 50k               Cash 50k

Mobile (5k)                 Profit (Goods found)

Loss (5k)                   Mobile lost (5k)

Loss (50k)                  Machine (50k) Fire


Ravi (10k)                  Goods (10k)
Loss (10k)                  Ravi (10k)


Assets          =     Capital + Libilities
Dr balance            Cr balance    

Assets increases (+) Dr    Credit increases (+) Cr
Assets decreases (-) Cr    Credit decreases (-) Dr


