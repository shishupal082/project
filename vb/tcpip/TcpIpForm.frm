VERSION 5.00
Object = "{248DD890-BB45-11CF-9ABC-0080C7E7B78D}#1.0#0"; "MSWINSCK.OCX"
Begin VB.Form TcpIpForm 
   Caption         =   "Form1"
   ClientHeight    =   5325
   ClientLeft      =   120
   ClientTop       =   465
   ClientWidth     =   10545
   LinkTopic       =   "Form1"
   ScaleHeight     =   5325
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
      Text            =   "Text2"
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
      Text            =   "Text1"
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
      Caption         =   "Label1"
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
Private SaveResponseDir As String
Dim File As New File
Private Method As New MethodClass
Dim HexToString As New HexToString
Dim StringToHex As New StringToHex
Dim HexCharToAscii As New HexCharToAscii
Dim Test As New TestClass





Private Function InitAppliction()

TimerCountValue = 0
RemotePort = 1521
LocalPort = 1521
RemoteHost = "127.0.0.1"
ServerText.Text = ""

SaveResponseDir = ""


Dim lineCount As Integer
Dim configData(256) As String
Dim appConfigFileName, configFileName As String
appConfigFileName = "config/app-config.txt"
configFileName = "config/config.txt"
' configFileName = "config.txt"

File.ReadFile appConfigFileName, configData, lineCount

If length = 1 Then
    configFileName = configData(0)
End If

Key = "1234"
ServerReceivedData = ""
AddLog "Application start"
End Function

Private Function ParseData(msg As String)

Dim responseFileName As String
responseFileName = SaveResponseDir & Format(Date, "yyyy-MM-dd") & "-" & Format(Hour(Time), "00") & "-" & Format(Minute(Time), "00") & ".log"

Open responseFileName For Append As #1
    Print #1, msg
Close #1
sleep (500)
Dim fileData(1000) As String
Dim fileLengthCount As Integer

File.ReadFile responseFileName, fileData, fileLengthCount


ServerReceivedData = "Parsed"

End Function


Private Function AddLog(ByVal msg As String)
File.LogText "log.txt", Key, msg
End Function

'Private Function AddLogArray(ByRef dataArr() As String, ByVal length As Integer)
'For I = 0 To length - 1
'    AddLog dataArr(I)
'Next
'End Function


Private Function UpdateServerLog(msg As String)
AddLog msg
ServerLog.Text = msg & vbCrLf & ServerLog.Text

End Function

Private Function UpdateClientLog(msg As String)
AddLog msg
ClientLog.Text = msg & vbCrLf & ClientLog.Text
End Function

Private Function SendDataFromServer() As String
    msg = ServerText.Text
    If msg = "" Then
        Exit Function
    End If
    If TimerCountValue Mod 5 > 0 Then
        Exit Function
    End If
    If TcpServer.State <> sckConnected Then
        UpdateServerLog "Not connected"
    Else
        TcpServer.SendData msg
        ServerText.Text = ""
    End If
End Function

Private Sub CloseClient_Click()
UpdateClientLog "Close client click"
TcpClient.Close
IsClientConnected = False
End Sub

Private Sub Form_Load()
InitAppliction
End Sub

Private Sub Form_Unload(Cancel As Integer)
TcpServer.Close
TcpClient.Close
End Sub


Private Sub SendFromClientButton_Click()
    If TcpClient.State <> sckConnected Then
        UpdateClientLog "Not connected"
    Else
        TcpClient.SendData ClientText.Text
    End If
End Sub

Private Sub ServerTimer_Timer()
TimerCountValue = TimerCountValue + 1
TimerCount.Caption = TimerCountValue
' SendDataFromServer
End Sub

Private Sub StartClient_Click()

UpdateClientLog "Start Client Click"
If IsClientConnected = False Then
    TcpClient.RemoteHost = RemoteHost
    TcpClient.RemotePort = RemotePort
    TcpClient.Connect
    IsClientConnected = True
    ClientLabel.Caption = RemoteHost & ":" & RemotePort
End If
End Sub

Private Sub StartServer_Click()

UpdateServerLog "Server Start Click"
If IsServerStarted = False Then
    TcpServer.LocalPort = LocalPort
    TcpServer.Listen
    IsServerStarted = True
    ServerLabel.Caption = LocalPort
    UpdateServerLog "Server started"
Else
    UpdateServerLog "Server already running"
End If

End Sub


Private Sub TcpClient_DataArrival(ByVal bytesTotal As Long)
Dim msg As String
TcpClient.GetData msg

ClientReceived.Text = msg
UpdateClientLog msg
End Sub

Private Sub TcpServer_ConnectionRequest(ByVal requestID As Long)

If TcpServer.State <> sckClosed Then
    TcpServer.Close
    UpdateServerLog "Closing existing TCP client"
End If
TcpServer.Accept requestID
UpdateServerLog "New client added: " & requestID

End Sub

Private Sub TcpServer_DataArrival(ByVal bytesTotal As Long)
Dim msg As String
Dim value As String
TcpServer.GetData msg

ParseData msg

ServerReceived.Text = ServerReceivedData
UpdateServerLog msg
End Sub
