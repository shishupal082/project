node ./google-sheets/index.js $1 $2
if [[ $1 = "mastersheet-division" ]]; then
    cp "C:/Dropbox/Dropbox/app-data/public/roleAttendanceUser/csv/google-drive/05-mastersheet-division.csv" "G:/My Drive/app-data-v5/public/mastersheet/csv/division-2023-06-07.csv"
    echo "Copy files from app-data to app-data-v5 completed."
fi

if [[ $1 = "mastersheet-section" ]]; then
    cp "C:/Dropbox/Dropbox/app-data/public/roleAttendanceUser/csv/google-drive/06-mastersheet-section.csv" "G:/My Drive/app-data-v5/public/mastersheet/csv/section-2023-06-07.csv"
    echo "Copy files from app-data to app-data-v5 completed."
fi
