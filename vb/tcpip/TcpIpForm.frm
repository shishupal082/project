VERSION 5.00
Object = "{248DD890-BB45-11CF-9ABC-0080C7E7B78D}#1.0#0"; "MSWINSCK.OCX"
Begin VB.Form TcpIpForm 
   Caption         =   "Form1"
   ClientHeight    =   6435
   ClientLeft      =   120
   ClientTop       =   465
   ClientWidth     =   10545
   LinkTopic       =   "Form1"
   ScaleHeight     =   6435
   ScaleWidth      =   10545
   StartUpPosition =   3  'Windows Default
   Begin VB.Timer ServerTimer 
      Interval        =   1000
      Left            =   3120
      Top             =   720
   End
   Begin VB.CommandButton CloseClient 
      Caption         =   "CloseClient"
      Height          =   495
      Left            =   7800
      TabIndex        =   12
      Top             =   600
      Width           =   1695
   End
   Begin VB.TextBox ClientLog 
      Height          =   2055
      Left            =   5760
      MultiLine       =   -1  'True
      ScrollBars      =   2  'Vertical
      TabIndex        =   9
      Text            =   "TcpIpForm.frx":0000
      Top             =   2880
      Width           =   4335
   End
   Begin VB.TextBox ServerLog 
      Height          =   2175
      Left            =   360
      MultiLine       =   -1  'True
      ScrollBars      =   2  'Vertical
      TabIndex        =   8
      Text            =   "TcpIpForm.frx":0006
      Top             =   2880
      Width           =   4215
   End
   Begin VB.CommandButton SendFromClientButton 
      Caption         =   "Send"
      Height          =   495
      Left            =   8160
      TabIndex        =   7
      Top             =   1320
      Width           =   1215
   End
   Begin VB.TextBox ClientText 
      Height          =   375
      Left            =   5880
      TabIndex        =   6
      Text            =   "ClientData"
      Top             =   1320
      Width           =   1575
   End
   Begin VB.CommandButton SendToClientButton 
      Caption         =   "Send"
      Height          =   375
      Left            =   2760
      TabIndex        =   5
      Top             =   1440
      Width           =   1095
   End
   Begin VB.TextBox ServerText 
      Height          =   375
      Left            =   360
      TabIndex        =   4
      Text            =   "ServerData"
      Top             =   1440
      Width           =   2175
   End
   Begin VB.TextBox ClientReceived 
      Height          =   615
      Left            =   5760
      MultiLine       =   -1  'True
      ScrollBars      =   2  'Vertical
      TabIndex        =   3
      Text            =   "TcpIpForm.frx":000C
      Top             =   1920
      Width           =   4335
   End
   Begin VB.TextBox ServerReceived 
      Height          =   615
      Left            =   240
      MultiLine       =   -1  'True
      ScrollBars      =   2  'Vertical
      TabIndex        =   2
      Text            =   "TcpIpForm.frx":0012
      Top             =   1920
      Width           =   4215
   End
   Begin MSWinsockLib.Winsock TcpClient 
      Left            =   9840
      Top             =   600
      _ExtentX        =   741
      _ExtentY        =   741
      _Version        =   393216
   End
   Begin VB.CommandButton StartClient 
      Caption         =   "StartClient"
      Height          =   615
      Left            =   5880
      TabIndex        =   1
      Top             =   600
      Width           =   1815
   End
   Begin VB.CommandButton StartServer 
      Caption         =   "StartServer"
      Height          =   735
      Left            =   240
      TabIndex        =   0
      Top             =   600
      Width           =   1575
   End
   Begin MSWinsockLib.Winsock TcpServer 
      Left            =   2400
      Top             =   720
      _ExtentX        =   741
      _ExtentY        =   741
      _Version        =   393216
      LocalPort       =   1521
   End
   Begin VB.Label AppConfig 
      Caption         =   "Config: "
      Height          =   975
      Left            =   360
      TabIndex        =   14
      Top             =   5280
      Width           =   9855
   End
   Begin VB.Label TimerCount 
      Caption         =   "TC"
      Height          =   255
      Left            =   3960
      TabIndex        =   13
      Top             =   1440
      Width           =   495
   End
   Begin VB.Label ServerLabel 
      Caption         =   "Label1"
      Height          =   375
      Left            =   360
      TabIndex        =   11
      Top             =   120
      Width           =   3135
   End
   Begin VB.Label ClientLabel 
      Caption         =   "Label2"
      Height          =   375
      Left            =   5880
      TabIndex        =   10
      Top             =   120
      Width           =   3855
   End
End
Attribute VB_Name = "TcpIpForm"
Attribute VB_GlobalNameSpace = False
Attribute VB_Creatable = False
Attribute VB_PredeclaredId = True
Attribute VB_Exposed = False
Private IsClientConnected As Boolean
Private IsServerStarted As Boolean
Private RemotePort, LocalPort As Integer
Private RemoteHost, Key, ServerReceivedData As String
Private TimerCountValue As Integer
Private SaveResponseDir, LogFilePath, IsEchoSystem As String
Private File As New File
Private Method As New MethodClass
Private HexToString As New HexToString
Private StringToHex As New StringToHex
Private HexCharToAscii As New HexCharToAscii
Private Test As New TestClass





Private Function InitAppliction()

TimerCountValue = 0
RemoteHost = "127.0.0.1"
RemotePort = 1521
LocalPort = 1521

IsEchoSystem = "False"
SaveResponseDir = ""
LogFilePath = "log.txt"


Dim lineCount As Integer
Dim appConfigData(256) As String
Dim configData(256) As String
Dim appConfigFileName, configFileName As String
appConfigFileName = "config/app-config.txt"
configFileName = "config/config.txt"

File.ReadFile appConfigFileName, appConfigData, lineCount

If lineCount > 0 Then
    configFileName = appConfigData(0)
End If

File.ReadFile configFileName, configData, lineCount

For I = 0 To lineCount
    If configData(I) = "tcpClient" Then
        I = I + 1
        RemoteHost = configData(I)
        I = I + 1
        RemotePort = configData(I)
    End If
    If configData(I) = "tcpServer" Then
        I = I + 1
        LocalPort = configData(I)
    End If
    If configData(I) = "logFilepath" Then
        I = I + 1
        LogFilePath = configData(I)
    End If
    If configData(I) = "isEchoSystem" Then
        I = I + 1
        IsEchoSystem = configData(I)
    End If
    If configData(I) = "saveResponseDir" Then
        I = I + 1
        SaveResponseDir = configData(I)
    End If
Next
Key = "1234"
Dim finalConfigData As String
finalConfigData = "TcpClient: " & RemoteHost & ":" & RemotePort
finalConfigData = finalConfigData & ", TcpServer: " & LocalPort
finalConfigData = finalConfigData & ", LogFilePath: " & LogFilePath
finalConfigData = finalConfigData & ", SaveResponseDir: " & SaveResponseDir
finalConfigData = finalConfigData & ", IsEchoSystem: " & IsEchoSystem
ServerReceivedData = ""
AddLog "configData: " & finalConfigData
AppConfig.Caption = AppConfig.Caption & finalConfigData


End Function


Private Function SaveReceivedData(msg As String, ByVal filename As String)

Dim responseFileName As String
responseFileName = SaveResponseDir & Format(Date, "yyyy-MM-dd") & "-" & Format(Hour(Time), "00") & "-" & Format(Minute(Time), "00") & Format(Second(Time), "00") & filename & ".log"

Open responseFileName For Append As #1
    Print #1, msg
Close #1
sleep (500)

End Function



Private Function AddLog(ByVal msg As String)
File.LogText LogFilePath, Key, msg
End Function


Private Function UpdateServerLog(msg As String)
AddLog "Server:" & msg
ServerLog.Text = msg & vbCrLf & ServerLog.Text

End Function

Private Function UpdateClientLog(msg As String)
AddLog "Client:" & msg
ClientLog.Text = msg & vbCrLf & ClientLog.Text
End Function

Private Sub CloseClient_Click()
TcpClient.Close
If IsClientConnected = True Then
    IsClientConnected = False
    UpdateClientLog "Client disconnected"
Else
    UpdateClientLog "Client is not running"
End If
End Sub

Private Sub Form_Load()
InitAppliction

AddLog "Application start"
End Sub


Private Sub Form_Unload(Cancel As Integer)
TcpServer.Close
TcpClient.Close
AddLog "Application closed"
End Sub


Private Function SendTextFromClient(ByVal msg As String)
    If TcpClient.State <> sckConnected Then
        UpdateClientLog "Not connected"
    Else
        TcpClient.SendData msg
    End If
End Function
Private Function SendTextFromServer(ByVal msg As String)
    If TcpServer.State <> sckConnected Then
        UpdateClientLog "Not connected"
    Else
        TcpServer.SendData msg
    End If
End Function

Private Sub SendFromClientButton_Click()
    SendTextFromClient ClientText.Text
End Sub

Private Sub SendToClientButton_Click()
    SendTextFromServer ServerText.Text
End Sub

Private Sub ServerTimer_Timer()
TimerCountValue = TimerCountValue + 1
TimerCount.Caption = TimerCountValue
' SendDataFromServer
End Sub

Private Sub StartClient_Click()

If IsClientConnected = False Then
    TcpClient.RemoteHost = RemoteHost
    TcpClient.RemotePort = RemotePort
    TcpClient.Connect
    IsClientConnected = True
    ClientLabel.Caption = RemoteHost & ":" & RemotePort
    UpdateClientLog "Client connected to " & RemoteHost & ":" & RemotePort
Else
    UpdateClientLog "Client already connected"
End If
End Sub

Private Sub StartServer_Click()

If IsServerStarted = False Then
    TcpServer.LocalPort = LocalPort
    TcpServer.Listen
    IsServerStarted = True
    ServerLabel.Caption = LocalPort
    UpdateServerLog "Server started on port: " & LocalPort
Else
    UpdateServerLog "Server already running"
End If

End Sub


Private Sub TcpClient_DataArrival(ByVal bytesTotal As Long)
Dim msg As String
TcpClient.GetData msg
SaveReceivedData msg, "client-received"
Dim isError As Boolean
isError = False

On Error GoTo A

If IsEchoSystem = "True" Then
    ClientReceived.Text = msg
'    UpdateClientLog msg
Else
    isError = True
    TcpServer.SendData msg
    isError = False
End If


A:

If isError Then
    UpdateClientLog "Error in sending data to server: " & msg
End If

UpdateClientLog msg

End Sub

Private Sub TcpServer_DataArrival(ByVal bytesTotal As Long)

Dim msg As String
TcpServer.GetData msg
SaveReceivedData msg, "server-received"

Dim isError As Boolean
isError = False

On Error GoTo A
If IsEchoSystem = "True" Then
    ServerReceived.Text = msg
    SendTextFromServer msg
'    UpdateServerLog msg
Else
    isError = True
    TcpClient.SendData msg
    isError = False
End If

A:

If isError Then
    UpdateServerLog "Error in sending data to client: " & msg
End If

UpdateServerLog msg
End Sub

Private Sub TcpServer_ConnectionRequest(ByVal requestID As Long)

If TcpServer.State <> sckClosed Then
    TcpServer.Close
    UpdateServerLog "Closing existing TCP client"
End If
TcpServer.Accept requestID
UpdateServerLog "New client added: " & requestID

End Sub


'Private Function convertStrToByte(ByVal data As String, ByRef length As Integer, ByRef result() As Byte)
'Dim charArr(1000) As String
'
'Method.ConvertStringToCharArr data, length, charArr
'Method.ConvertStringToCharArr charArr, length, result
'End Function
'
'Private Function sendDataFromClient(ByVal data As String)
'Dim length As Integer
'Dim byteArr(1000) As Byte
'For I = 0 To length
'    TcpClient.SendData byteArr(I)
'    sleep (10)
'Next
'
'End Function
'
'Private Function sendDataFromServer(ByVal data As String)
'Dim length As Integer
'Dim byteArr(1000) As Byte
'For I = 0 To length
'    TcpServer.SendData byteArr(I)
'    sleep (10)
'Next
'
'End Function
'
