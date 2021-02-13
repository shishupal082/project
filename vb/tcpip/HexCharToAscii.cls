VERSION 1.0 CLASS
BEGIN
  MultiUse = -1  'True
  Persistable = 0  'NotPersistable
  DataBindingBehavior = 0  'vbNone
  DataSourceBehavior  = 0  'vbNone
  MTSTransactionMode  = 0  'NotAnMTSObject
END
Attribute VB_Name = "HexCharToAscii"
Attribute VB_GlobalNameSpace = False
Attribute VB_Creatable = True
Attribute VB_PredeclaredId = False
Attribute VB_Exposed = False
Public Function Convert(ByRef inputBuffer() As String, ByVal length As Integer, ByRef outputBuffer() As String)

For I = 0 To length - 1
    outputBuffer(I) = charToString(inputBuffer(I))
Next

End Function


Private Function charToString(ByVal character As String) As String

Dim result As String
character = UCase(character)


Select Case character
    Case "00"
        result = "NUL"
    Case "01"
        result = "SOH"
    Case "02"
        result = "STX"
    Case "03"
        result = "ETX"
    Case "04"
        result = "EOT"
    Case "05"
        result = "ENQ"
    Case "06"
        result = "ACK"
    Case "07"
        result = "BEL"
    Case "08"
        result = "BS"
    Case "09"
        result = "HT"
    Case "0A"
        result = "LF"
    Case "0B"
        result = "VT"
    Case "0C"
        result = "FF"
    Case "0D"
        result = "CR"
    Case "0E"
        result = "SO"
    Case "0F"
        result = "SI"
    Case "10"
        result = "DLE"
    Case "11"
        result = "DC1"
    Case "12"
        result = "DC2"
    Case "13"
        result = "DC3"
    Case "14"
        result = "DC4"
    Case "15"
        result = "NAK"
    Case "16"
        result = "SYN"
    Case "17"
        result = "ETB"
    Case "18"
        result = "CAN"
    Case "19"
        result = "EM"
    Case "1A"
        result = "SUB"
    Case "1B"
        result = "ESC"
    Case "1C"
        result = "FS"
    Case "1D"
        result = "GS"
    Case "1E"
        result = "RS"
    Case "1F"
        result = "US"
    Case "20"
        result = "Space"
    Case "21"
        result = "!"
    Case "22"
        result = "Double quot"
    Case "23"
        result = "#"
    Case "24"
        result = "$"
    Case "25"
        result = "%"
    Case "26"
        result = "&"
    Case "27"
        result = "Single quot"
    Case "28"
        result = "("
    Case "29"
        result = ")"
    Case "2A"
        result = "*"
    Case "2B"
        result = "+"
    Case "2C"
        result = ","
    Case "2D"
        result = "-"
    Case "2E"
        result = "."
    Case "2F"
        result = "/"
    Case "30"
        result = "0"
    Case "31"
        result = "1"
    Case "32"
        result = "2"
    Case "33"
        result = "3"
    Case "34"
        result = "4"
    Case "35"
        result = "5"
    Case "36"
        result = "6"
    Case "37"
        result = "7"
    Case "38"
        result = "8"
    Case "39"
        result = "9"
    Case "3A"
        result = ":"
    Case "3B"
        result = ";"
    Case "3C"
        result = "<"
    Case "3D"
        result = "="
    Case "3E"
        result = ">"
    Case "3F"
        result = "?"
    Case "40"
        result = "@"
    Case "41"
        result = "A"
    Case "42"
        result = "B"
    Case "43"
        result = "C"
    Case "44"
        result = "D"
    Case "45"
        result = "E"
    Case "46"
        result = "F"
    Case "47"
        result = "G"
    Case "48"
        result = "H"
    Case "49"
        result = "I"
    Case "4A"
        result = "J"
    Case "4B"
        result = "K"
    Case "4C"
        result = "L"
    Case "4D"
        result = "M"
    Case "4E"
        result = "N"
    Case "4F"
        result = "O"
    Case "50"
        result = "P"
    Case "51"
        result = "Q"
    Case "52"
        result = "R"
    Case "53"
        result = "S"
    Case "54"
        result = "T"
    Case "55"
        result = "U"
    Case "56"
        result = "V"
    Case "57"
        result = "W"
    Case "58"
        result = "X"
    Case "59"
        result = "Y"
    Case "5A"
        result = "Z"
    Case "5B"
        result = "["
    Case "5C"
        result = "\"
    Case "5D"
        result = "]"
    Case "5E"
        result = "^"
    Case "5F"
        result = "_"
    Case "60"
        result = "`"
    Case "61"
        result = "a"
    Case "62"
        result = "b"
    Case "63"
        result = "c"
    Case "64"
        result = "d"
    Case "65"
        result = "e"
    Case "66"
        result = "f"
    Case "67"
        result = "g"
    Case "68"
        result = "h"
    Case "69"
        result = "i"
    Case "6A"
        result = "j"
    Case "6B"
        result = "k"
    Case "6C"
        result = "l"
    Case "6D"
        result = "m"
    Case "6E"
        result = "n"
    Case "6F"
        result = "o"
    Case "70"
        result = "p"
    Case "71"
        result = "q"
    Case "72"
        result = "r"
    Case "73"
        result = "s"
    Case "74"
        result = "t"
    Case "75"
        result = "u"
    Case "76"
        result = "v"
    Case "77"
        result = "w"
    Case "78"
        result = "x"
    Case "79"
        result = "y"
    Case "7A"
        result = "z"
    Case "7B"
        result = "{"
    Case "7C"
        result = "|"
    Case "7D"
        result = "}"
    Case "7E"
        result = "~"
    Case "7F"
        result = "DEL"
    Case "80"
        result = "�"
    Case "81"
        result = ""
    Case "82"
        result = "� low comma"
    Case "83"
        result = "�"
    Case "84"
        result = "low double quot"
    Case "85"
        result = "�"
    Case "86"
        result = "�"
    Case "87"
        result = "�"
    Case "88"
        result = "� modifier"
    Case "89"
        result = "�"
    Case "8A"
        result = "�"
    Case "8B"
        result = "�"
    Case "8C"
        result = "�"
    Case "8D"
        result = ""
    Case "8E"
        result = "�"
    Case "8F"
        result = ""
    Case "90"
        result = ""
    Case "91"
        result = "� left side quotation"
    Case "92"
        result = "� right side quotation"
    Case "93"
        result = "� left double"
    Case "94"
        result = "� right double"
    Case "95"
        result = "� bull"
    Case "96"
        result = "� En dash"
    Case "97"
        result = "� Em dash"
    Case "98"
        result = "� "
    Case "99"
        result = "�"
    Case "9A"
        result = "�"
    Case "9B"
        result = "� quotation"
    Case "9C"
        result = "�"
    Case "9D"
        result = ""
    Case "9E"
        result = "�"
    Case "9F"
        result = "�"
    Case "A0"
        result = "nbsp"
    Case "A1"
        result = "� inverted !"
    Case "A2"
        result = "�"
    Case "A3"
        result = "�"
    Case "A4"
        result = "�"
    Case "A5"
        result = "�"
    Case "A6"
        result = "�"
    Case "A7"
        result = "�"
    Case "A8"
        result = "�"
    Case "A9"
        result = "�"
    Case "AA"
        result = "�"
    Case "AB"
        result = "�"
    Case "AC"
        result = "�"
    Case "AD"
        result = ""
    Case "AE"
        result = "�"
    Case "AF"
        result = "�"
    Case "B0"
        result = "�"
    Case "B1"
        result = "�"
    Case "B2"
        result = "�"
    Case "B3"
        result = "�"
    Case "B4"
        result = "�"
    Case "B5"
        result = "�"
    Case "B6"
        result = "�"
    Case "B7"
        result = "�"
    Case "B8"
        result = "�"
    Case "B9"
        result = "�"
    Case "BA"
        result = "�"
    Case "BB"
        result = "�"
    Case "BC"
        result = "�"
    Case "BD"
        result = "�"
    Case "BE"
        result = "�"
    Case "BF"
        result = "�"
    Case "C0"
        result = "�"
    Case "C1"
        result = "�"
    Case "C2"
        result = "�"
    Case "C3"
        result = "�"
    Case "C4"
        result = "�"
    Case "C5"
        result = "�"
    Case "C6"
        result = "�"
    Case "C7"
        result = "�"
    Case "C8"
        result = "�"
    Case "C9"
        result = "�"
    Case "CA"
        result = "�"
    Case "CB"
        result = "�"
    Case "CC"
        result = "�"
    Case "CD"
        result = "�"
    Case "CE"
        result = "�"
    Case "CF"
        result = "�"
    Case "D0"
        result = "�"
    Case "D1"
        result = "�"
    Case "D2"
        result = "�"
    Case "D3"
        result = "�"
    Case "D4"
        result = "�"
    Case "D5"
        result = "�"
    Case "D6"
        result = "�"
    Case "D7"
        result = "�"
    Case "D8"
        result = "�"
    Case "D9"
        result = "�"
    Case "DA"
        result = "�"
    Case "DB"
        result = "�"
    Case "DC"
        result = "�"
    Case "DD"
        result = "�"
    Case "DE"
        result = "�"
    Case "DF"
        result = "�"
    Case "E0"
        result = "�"
    Case "E1"
        result = "�"
    Case "E2"
        result = "�"
    Case "E3"
        result = "�"
    Case "E4"
        result = "�"
    Case "E5"
        result = "�"
    Case "E6"
        result = "�"
    Case "E7"
        result = "�"
    Case "E8"
        result = "�"
    Case "E9"
        result = "�"
    Case "EA"
        result = "�"
    Case "EB"
        result = "�"
    Case "EC"
        result = "�"
    Case "ED"
        result = "�"
    Case "EE"
        result = "�"
    Case "EF"
        result = "�"
    Case "F0"
        result = "�"
    Case "F1"
        result = "�"
    Case "F2"
        result = "�"
    Case "F3"
        result = "�"
    Case "F4"
        result = "�"
    Case "F5"
        result = "�"
    Case "F6"
        result = "�"
    Case "F7"
        result = "�"
    Case "F8"
        result = "�"
    Case "F9"
        result = "�"
    Case "FA"
        result = "�"
    Case "FB"
        result = "�"
    Case "FC"
        result = "�"
    Case "FD"
        result = "�"
    Case "FE"
        result = "�"
    Case "FF"
        result = "�"
    Case Else
        result = "Not matching"
End Select

charToString = result

End Function







