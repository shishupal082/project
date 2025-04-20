output-1
12524
https://smms.indianrailways.gov.in/api/api/location/get
{
isServerSidePagination: false
pageNumber: 1,
recordsPerPage: "",
filters: {
	locationtype: "Station/IBH"
},
order: [["locationcode", "ASC"]]
}



output-2
2969
https://smms.indianrailways.gov.in/api/api/location/get
{
isServerSidePagination: false
pageNumber: 1,
recordsPerPage: "",
filters: {
	locationtype: "Independent LC Gates (In non-automatic section)"
},
order: [["locationcode", "ASC"]]
}

output-3: Station / Location which are not mapped with section
21
https://smms.indianrailways.gov.in/api/api/location/get
{
isServerSidePagination: false
pageNumber: 1,
recordsPerPage: "",
filters: {
	zone: "South Eastern Railway",
	division: "Ranchi",
	section: null
}
}
