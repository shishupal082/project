VERSION 1.0 CLASS
BEGIN
  MultiUse = -1  'True
  Persistable = 0  'NotPersistable
  DataBindingBehavior = 0  'vbNone
  DataSourceBehavior  = 0  'vbNone
  MTSTransactionMode  = 0  'NotAnMTSObject
END
Attribute VB_Name = "StringToHex"
Attribute VB_GlobalNameSpace = False
Attribute VB_Creatable = True
Attribute VB_PredeclaredId = False
Attribute VB_Exposed = False
Public Function Convert(ByRef inputBuffer() As String, ByVal length As Integer, ByRef outputBuffer() As Byte)

For I = 0 To length - 1
    outputBuffer(I) = charToHex(inputBuffer(I))
Next

End Function


Private Function charToHex(ByVal character As String) As Byte

Dim result As Byte
character = UCase(character)

Select Case character
    Case "00"
        result = &H0
    Case "01"
        result = &H1
    Case "02"
        result = &H2
    Case "03"
        result = &H3
    Case "04"
        result = &H4
    Case "05"
        result = &H5
    Case "06"
        result = &H6
    Case "07"
        result = &H7
    Case "08"
        result = &H8
    Case "09"
        result = &H9
    Case "0A"
        result = &HA
    Case "0B"
        result = &HB
    Case "0C"
        result = &HC
    Case "0D"
        result = &HD
    Case "0E"
        result = &HE
    Case "0F"
        result = &HF
    Case "10"
        result = &H10
    Case "11"
        result = &H11
    Case "12"
        result = &H12
    Case "13"
        result = &H13
    Case "14"
        result = &H14
    Case "15"
        result = &H15
    Case "16"
        result = &H16
    Case "17"
        result = &H17
    Case "18"
        result = &H18
    Case "19"
        result = &H19
    Case "1A"
        result = &H1A
    Case "1B"
        result = &H1B
    Case "1C"
        result = &H1C
    Case "1D"
        result = &H1D
    Case "1E"
        result = &H1E
    Case "1F"
        result = &H1F
    Case "20"
        result = &H20
    Case "21"
        result = &H21
    Case "22"
        result = &H22
    Case "23"
        result = &H23
    Case "24"
        result = &H24
    Case "25"
        result = &H25
    Case "26"
        result = &H26
    Case "27"
        result = &H27
    Case "28"
        result = &H28
    Case "29"
        result = &H29
    Case "2A"
        result = &H2A
    Case "2B"
        result = &H2B
    Case "2C"
        result = &H2C
    Case "2D"
        result = &H2D
    Case "2E"
        result = &H2E
    Case "2F"
        result = &H2F
    Case "30"
        result = &H30
    Case "31"
        result = &H31
    Case "32"
        result = &H32
    Case "33"
        result = &H33
    Case "34"
        result = &H34
    Case "35"
        result = &H35
    Case "36"
        result = &H36
    Case "37"
        result = &H37
    Case "38"
        result = &H38
    Case "39"
        result = &H39
    Case "3A"
        result = &H3A
    Case "3B"
        result = &H3B
    Case "3C"
        result = &H3C
    Case "3D"
        result = &H3D
    Case "3E"
        result = &H3E
    Case "3F"
        result = &H3F
    Case "40"
        result = &H40
    Case "41"
        result = &H41
    Case "42"
        result = &H42
    Case "43"
        result = &H43
    Case "44"
        result = &H44
    Case "45"
        result = &H45
    Case "46"
        result = &H46
    Case "47"
        result = &H47
    Case "48"
        result = &H48
    Case "49"
        result = &H49
    Case "4A"
        result = &H4A
    Case "4B"
        result = &H4B
    Case "4C"
        result = &H4C
    Case "4D"
        result = &H4D
    Case "4E"
        result = &H4E
    Case "4F"
        result = &H4F
    Case "50"
        result = &H50
    Case "51"
        result = &H51
    Case "52"
        result = &H52
    Case "53"
        result = &H53
    Case "54"
        result = &H54
    Case "55"
        result = &H55
    Case "56"
        result = &H56
    Case "57"
        result = &H57
    Case "58"
        result = &H58
    Case "59"
        result = &H59
    Case "5A"
        result = &H5A
    Case "5B"
        result = &H5B
    Case "5C"
        result = &H5C
    Case "5D"
        result = &H5D
    Case "5E"
        result = &H5E
    Case "5F"
        result = &H5F
    Case "60"
        result = &H60
    Case "61"
        result = &H61
    Case "62"
        result = &H62
    Case "63"
        result = &H63
    Case "64"
        result = &H64
    Case "65"
        result = &H65
    Case "66"
        result = &H66
    Case "67"
        result = &H67
    Case "68"
        result = &H68
    Case "69"
        result = &H69
    Case "6A"
        result = &H6A
    Case "6B"
        result = &H6B
    Case "6C"
        result = &H6C
    Case "6D"
        result = &H6D
    Case "6E"
        result = &H6E
    Case "6F"
        result = &H6F
    Case "70"
        result = &H70
    Case "71"
        result = &H71
    Case "72"
        result = &H72
    Case "73"
        result = &H73
    Case "74"
        result = &H74
    Case "75"
        result = &H75
    Case "76"
        result = &H76
    Case "77"
        result = &H77
    Case "78"
        result = &H78
    Case "79"
        result = &H79
    Case "7A"
        result = &H7A
    Case "7B"
        result = &H7B
    Case "7C"
        result = &H7C
    Case "7D"
        result = &H7D
    Case "7E"
        result = &H7E
    Case "7F"
        result = &H7F
    Case "80"
        result = &H80
    Case "81"
        result = &H81
    Case "82"
        result = &H82
    Case "83"
        result = &H83
    Case "84"
        result = &H84
    Case "85"
        result = &H85
    Case "86"
        result = &H86
    Case "87"
        result = &H87
    Case "88"
        result = &H88
    Case "89"
        result = &H89
    Case "8A"
        result = &H8A
    Case "8B"
        result = &H8B
    Case "8C"
        result = &H8C
    Case "8D"
        result = &H8D
    Case "8E"
        result = &H8E
    Case "8F"
        result = &H8F
    Case "90"
        result = &H90
    Case "91"
        result = &H91
    Case "92"
        result = &H92
    Case "93"
        result = &H93
    Case "94"
        result = &H94
    Case "95"
        result = &H95
    Case "96"
        result = &H96
    Case "97"
        result = &H97
    Case "98"
        result = &H98
    Case "99"
        result = &H99
    Case "9A"
        result = &H9A
    Case "9B"
        result = &H9B
    Case "9C"
        result = &H9C
    Case "9D"
        result = &H9D
    Case "9E"
        result = &H9E
    Case "9F"
        result = &H9F
    Case "A0"
        result = &HA0
    Case "A1"
        result = &HA1
    Case "A2"
        result = &HA2
    Case "A3"
        result = &HA3
    Case "A4"
        result = &HA4
    Case "A5"
        result = &HA5
    Case "A6"
        result = &HA6
    Case "A7"
        result = &HA7
    Case "A8"
        result = &HA8
    Case "A9"
        result = &HA9
    Case "AA"
        result = &HAA
    Case "AB"
        result = &HAB
    Case "AC"
        result = &HAC
    Case "AD"
        result = &HAD
    Case "AE"
        result = &HAE
    Case "AF"
        result = &HAF
    Case "B0"
        result = &HB0
    Case "B1"
        result = &HB1
    Case "B2"
        result = &HB2
    Case "B3"
        result = &HB3
    Case "B4"
        result = &HB4
    Case "B5"
        result = &HB5
    Case "B6"
        result = &HB6
    Case "B7"
        result = &HB7
    Case "B8"
        result = &HB8
    Case "B9"
        result = &HB9
    Case "BA"
        result = &HBA
    Case "BB"
        result = &HBB
    Case "BC"
        result = &HBC
    Case "BD"
        result = &HBD
    Case "BE"
        result = &HBE
    Case "BF"
        result = &HBF
    Case "C0"
        result = &HC0
    Case "C1"
        result = &HC1
    Case "C2"
        result = &HC2
    Case "C3"
        result = &HC3
    Case "C4"
        result = &HC4
    Case "C5"
        result = &HC5
    Case "C6"
        result = &HC6
    Case "C7"
        result = &HC7
    Case "C8"
        result = &HC8
    Case "C9"
        result = &HC9
    Case "CA"
        result = &HCA
    Case "CB"
        result = &HCB
    Case "CC"
        result = &HCC
    Case "CD"
        result = &HCD
    Case "CE"
        result = &HCE
    Case "CF"
        result = &HCF
    Case "D0"
        result = &HD0
    Case "D1"
        result = &HD1
    Case "D2"
        result = &HD2
    Case "D3"
        result = &HD3
    Case "D4"
        result = &HD4
    Case "D5"
        result = &HD5
    Case "D6"
        result = &HD6
    Case "D7"
        result = &HD7
    Case "D8"
        result = &HD8
    Case "D9"
        result = &HD9
    Case "DA"
        result = &HDA
    Case "DB"
        result = &HDB
    Case "DC"
        result = &HDC
    Case "DD"
        result = &HDD
    Case "DE"
        result = &HDE
    Case "DF"
        result = &HDF
    Case "E0"
        result = &HE0
    Case "E1"
        result = &HE1
    Case "E2"
        result = &HE2
    Case "E3"
        result = &HE3
    Case "E4"
        result = &HE4
    Case "E5"
        result = &HE5
    Case "E6"
        result = &HE6
    Case "E7"
        result = &HE7
    Case "E8"
        result = &HE8
    Case "E9"
        result = &HE9
    Case "EA"
        result = &HEA
    Case "EB"
        result = &HEB
    Case "EC"
        result = &HEC
    Case "ED"
        result = &HED
    Case "EE"
        result = &HEE
    Case "EF"
        result = &HEF
    Case "F0"
        result = &HF0
    Case "F1"
        result = &HF1
    Case "F2"
        result = &HF2
    Case "F3"
        result = &HF3
    Case "F4"
        result = &HF4
    Case "F5"
        result = &HF5
    Case "F6"
        result = &HF6
    Case "F7"
        result = &HF7
    Case "F8"
        result = &HF8
    Case "F9"
        result = &HF9
    Case "FA"
        result = &HFA
    Case "FB"
        result = &HFB
    Case "FC"
        result = &HFC
    Case "FD"
        result = &HFD
    Case "FE"
        result = &HFE
    Case "FF"
        result = &HFF
    Case Else
        result = &H0
End Select

charToHex = result

End Function







