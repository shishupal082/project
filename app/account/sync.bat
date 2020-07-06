@echo off
echo "Coping index.html file."
copy index.html currentbal
copy index.html currentbalbydate
copy index.html journal
copy index.html trialbalance
copy index.html journalbydate
copy index.html ledger
copy index.html summary
copy index.html summarybydate
copy index.html summarybycalander
copy index.html customisedebit
copy index.html customisecredit

echo "Copy file completed."

@echo off
set /p id="Press enter key to exit"
