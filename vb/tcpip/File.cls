VERSION 1.0 CLASS
BEGIN
  MultiUse = -1  'True
  Persistable = 0  'NotPersistable
  DataBindingBehavior = 0  'vbNone
  DataSourceBehavior  = 0  'vbNone
  MTSTransactionMode  = 0  'NotAnMTSObject
END
Attribute VB_Name = "File"
Attribute VB_GlobalNameSpace = False
Attribute VB_Creatable = True
Attribute VB_PredeclaredId = False
Attribute VB_Exposed = False
Public Function ReadFile(fileName As String, ByRef fileData() As String, ByRef fileLength As Integer)

Dim fileDataLineCount As Integer
Dim sFileText As String
Dim iFileNo As Integer
iFileNo = FreeFile
On Error GoTo A
Open fileName For Input As #iFileNo
Do While Not EOF(iFileNo)
  Input #iFileNo, sFileText
  fileData(fileDataLineCount) = sFileText
  fileDataLineCount = fileDataLineCount + 1
Loop
Close #iFileNo
sleep (20)

A:
fileLength = fileDataLineCount
End Function


Public Function LogText(ByVal filePath As String, ByVal Key As String, ByVal msg As String)
Open filePath For Append As #1
    Print #1, Format(Date, "yyyy/MM/dd") & "@" & Format(Hour(Time), "00") & ":" & Format(Minute(Time), "00") & ":" & Format(Second(Time), "00") & " - " & Key & " - " & msg
Close #1
End Function

