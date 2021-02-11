VERSION 1.0 CLASS
BEGIN
  MultiUse = -1  'True
  Persistable = 0  'NotPersistable
  DataBindingBehavior = 0  'vbNone
  DataSourceBehavior  = 0  'vbNone
  MTSTransactionMode  = 0  'NotAnMTSObject
END
Attribute VB_Name = "HexToString"
Attribute VB_GlobalNameSpace = False
Attribute VB_Creatable = True
Attribute VB_PredeclaredId = False
Attribute VB_Exposed = False
Public Function Convert(ByRef inputBuffer() As Byte, ByVal length As Integer, ByRef outputBuffer() As String)
For I = 0 To length - 1
    outputBuffer(I) = HexToStr(inputBuffer(I))
Next
End Function

Private Function HexToStr(byteChar As Byte) As String

Dim result As String

Select Case byteChar
    Case &H0
        result = "00"
    Case &H1
        result = "01"
    Case &H2
        result = "02"
    Case &H3
        result = "03"
    Case &H4
        result = "04"
    Case &H5
        result = "05"
    Case &H6
        result = "06"
    Case &H7
        result = "07"
    Case &H8
        result = "08"
    Case &H9
        result = "09"
    Case &HA
        result = "0A"
    Case &HB
        result = "0B"
    Case &HC
        result = "0C"
    Case &HD
        result = "0D"
    Case &HE
        result = "0E"
    Case &HF
        result = "0F"
    Case &H10
        result = "10"
    Case &H11
        result = "11"
    Case &H12
        result = "12"
    Case &H13
        result = "13"
    Case &H14
        result = "14"
    Case &H15
        result = "15"
    Case &H16
        result = "16"
    Case &H17
        result = "17"
    Case &H18
        result = "18"
    Case &H19
        result = "19"
    Case &H1A
        result = "1A"
    Case &H1B
        result = "1B"
    Case &H1C
        result = "1C"
    Case &H1D
        result = "1D"
    Case &H1E
        result = "1E"
    Case &H1F
        result = "1F"
    Case &H20
        result = "20"
    Case &H21
        result = "21"
    Case &H22
        result = "22"
    Case &H23
        result = "23"
    Case &H24
        result = "24"
    Case &H25
        result = "25"
    Case &H26
        result = "26"
    Case &H27
        result = "27"
    Case &H28
        result = "28"
    Case &H29
        result = "29"
    Case &H2A
        result = "2A"
    Case &H2B
        result = "2B"
    Case &H2C
        result = "2C"
    Case &H2D
        result = "2D"
    Case &H2E
        result = "2E"
    Case &H2F
        result = "2F"
    Case &H30
        result = "30"
    Case &H31
        result = "31"
    Case &H32
        result = "32"
    Case &H33
        result = "33"
    Case &H34
        result = "34"
    Case &H35
        result = "35"
    Case &H36
        result = "36"
    Case &H37
        result = "37"
    Case &H38
        result = "38"
    Case &H39
        result = "39"
    Case &H3A
        result = "3A"
    Case &H3B
        result = "3B"
    Case &H3C
        result = "3C"
    Case &H3D
        result = "3D"
    Case &H3E
        result = "3E"
    Case &H3F
        result = "3F"
    Case &H40
        result = "40"
    Case &H41
        result = "41"
    Case &H42
        result = "42"
    Case &H43
        result = "43"
    Case &H44
        result = "44"
    Case &H45
        result = "45"
    Case &H46
        result = "46"
    Case &H47
        result = "47"
    Case &H48
        result = "48"
    Case &H49
        result = "49"
    Case &H4A
        result = "4A"
    Case &H4B
        result = "4B"
    Case &H4C
        result = "4C"
    Case &H4D
        result = "4D"
    Case &H4E
        result = "4E"
    Case &H4F
        result = "4F"
    Case &H50
        result = "50"
    Case &H51
        result = "51"
    Case &H52
        result = "52"
    Case &H53
        result = "53"
    Case &H54
        result = "54"
    Case &H55
        result = "55"
    Case &H56
        result = "56"
    Case &H57
        result = "57"
    Case &H58
        result = "58"
    Case &H59
        result = "59"
    Case &H5A
        result = "5A"
    Case &H5B
        result = "5B"
    Case &H5C
        result = "5C"
    Case &H5D
        result = "5D"
    Case &H5E
        result = "5E"
    Case &H5F
        result = "5F"
    Case &H60
        result = "60"
    Case &H61
        result = "61"
    Case &H62
        result = "62"
    Case &H63
        result = "63"
    Case &H64
        result = "64"
    Case &H65
        result = "65"
    Case &H66
        result = "66"
    Case &H67
        result = "67"
    Case &H68
        result = "68"
    Case &H69
        result = "69"
    Case &H6A
        result = "6A"
    Case &H6B
        result = "6B"
    Case &H6C
        result = "6C"
    Case &H6D
        result = "6D"
    Case &H6E
        result = "6E"
    Case &H6F
        result = "6F"
    Case &H70
        result = "70"
    Case &H71
        result = "71"
    Case &H72
        result = "72"
    Case &H73
        result = "73"
    Case &H74
        result = "74"
    Case &H75
        result = "75"
    Case &H76
        result = "76"
    Case &H77
        result = "77"
    Case &H78
        result = "78"
    Case &H79
        result = "79"
    Case &H7A
        result = "7A"
    Case &H7B
        result = "7B"
    Case &H7C
        result = "7C"
    Case &H7D
        result = "7D"
    Case &H7E
        result = "7E"
    Case &H7F
        result = "7F"
    Case &H80
        result = "80"
    Case &H81
        result = "81"
    Case &H82
        result = "82"
    Case &H83
        result = "83"
    Case &H84
        result = "84"
    Case &H85
        result = "85"
    Case &H86
        result = "86"
    Case &H87
        result = "87"
    Case &H88
        result = "88"
    Case &H89
        result = "89"
    Case &H8A
        result = "8A"
    Case &H8B
        result = "8B"
    Case &H8C
        result = "8C"
    Case &H8D
        result = "8D"
    Case &H8E
        result = "8E"
    Case &H8F
        result = "8F"
    Case &H90
        result = "90"
    Case &H91
        result = "91"
    Case &H92
        result = "92"
    Case &H93
        result = "93"
    Case &H94
        result = "94"
    Case &H95
        result = "95"
    Case &H96
        result = "96"
    Case &H97
        result = "97"
    Case &H98
        result = "98"
    Case &H99
        result = "99"
    Case &H9A
        result = "9A"
    Case &H9B
        result = "9B"
    Case &H9C
        result = "9C"
    Case &H9D
        result = "9D"
    Case &H9E
        result = "9E"
    Case &H9F
        result = "9F"
    Case &HA0
        result = "A0"
    Case &HA1
        result = "A1"
    Case &HA2
        result = "A2"
    Case &HA3
        result = "A3"
    Case &HA4
        result = "A4"
    Case &HA5
        result = "A5"
    Case &HA6
        result = "A6"
    Case &HA7
        result = "A7"
    Case &HA8
        result = "A8"
    Case &HA9
        result = "A9"
    Case &HAA
        result = "AA"
    Case &HAB
        result = "AB"
    Case &HAC
        result = "AC"
    Case &HAD
        result = "AD"
    Case &HAE
        result = "AE"
    Case &HAF
        result = "AF"
    Case &HB0
        result = "B0"
    Case &HB1
        result = "B1"
    Case &HB2
        result = "B2"
    Case &HB3
        result = "B3"
    Case &HB4
        result = "B4"
    Case &HB5
        result = "B5"
    Case &HB6
        result = "B6"
    Case &HB7
        result = "B7"
    Case &HB8
        result = "B8"
    Case &HB9
        result = "B9"
    Case &HBA
        result = "BA"
    Case &HBB
        result = "BB"
    Case &HBC
        result = "BC"
    Case &HBD
        result = "BD"
    Case &HBE
        result = "BE"
    Case &HBF
        result = "BF"
    Case &HC0
        result = "C0"
    Case &HC1
        result = "C1"
    Case &HC2
        result = "C2"
    Case &HC3
        result = "C3"
    Case &HC4
        result = "C4"
    Case &HC5
        result = "C5"
    Case &HC6
        result = "C6"
    Case &HC7
        result = "C7"
    Case &HC8
        result = "C8"
    Case &HC9
        result = "C9"
    Case &HCA
        result = "CA"
    Case &HCB
        result = "CB"
    Case &HCC
        result = "CC"
    Case &HCD
        result = "CD"
    Case &HCE
        result = "CE"
    Case &HCF
        result = "CF"
    Case &HD0
        result = "D0"
    Case &HD1
        result = "D1"
    Case &HD2
        result = "D2"
    Case &HD3
        result = "D3"
    Case &HD4
        result = "D4"
    Case &HD5
        result = "D5"
    Case &HD6
        result = "D6"
    Case &HD7
        result = "D7"
    Case &HD8
        result = "D8"
    Case &HD9
        result = "D9"
    Case &HDA
        result = "DA"
    Case &HDB
        result = "DB"
    Case &HDC
        result = "DC"
    Case &HDD
        result = "DD"
    Case &HDE
        result = "DE"
    Case &HDF
        result = "DF"
    Case &HE0
        result = "E0"
    Case &HE1
        result = "E1"
    Case &HE2
        result = "E2"
    Case &HE3
        result = "E3"
    Case &HE4
        result = "E4"
    Case &HE5
        result = "E5"
    Case &HE6
        result = "E6"
    Case &HE7
        result = "E7"
    Case &HE8
        result = "E8"
    Case &HE9
        result = "E9"
    Case &HEA
        result = "EA"
    Case &HEB
        result = "EB"
    Case &HEC
        result = "EC"
    Case &HED
        result = "ED"
    Case &HEE
        result = "EE"
    Case &HEF
        result = "EF"
    Case &HF0
        result = "F0"
    Case &HF1
        result = "F1"
    Case &HF2
        result = "F2"
    Case &HF3
        result = "F3"
    Case &HF4
        result = "F4"
    Case &HF5
        result = "F5"
    Case &HF6
        result = "F6"
    Case &HF7
        result = "F7"
    Case &HF8
        result = "F8"
    Case &HF9
        result = "F9"
    Case &HFA
        result = "FA"
    Case &HFB
        result = "FB"
    Case &HFC
        result = "FC"
    Case &HFD
        result = "FD"
    Case &HFE
        result = "FE"
    Case &HFF
        result = "FF"
    Case Else
        result = "00"
End Select

HexToStr = result

End Function



