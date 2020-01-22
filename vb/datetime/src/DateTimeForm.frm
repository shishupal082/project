VERSION 5.00
Begin VB.Form DateTimeForm 
   Caption         =   "DateTimeForm"
   ClientHeight    =   3990
   ClientLeft      =   120
   ClientTop       =   465
   ClientWidth     =   4815
   LinkTopic       =   "Form1"
   MaxButton       =   0   'False
   MinButton       =   0   'False
   ScaleHeight     =   3990
   ScaleWidth      =   4815
   StartUpPosition =   3  'Windows Default
   Begin VB.CommandButton StartTime 
      Caption         =   "StartTime"
      Height          =   615
      Left            =   0
      TabIndex        =   1
      Top             =   720
      Width           =   2535
   End
   Begin VB.CommandButton DateTimeField 
      Caption         =   "Date Time"
      Height          =   615
      Left            =   0
      TabIndex        =   0
      Top             =   0
      Width           =   2535
   End
   Begin VB.Timer Timer1 
      Interval        =   1000
      Left            =   2760
      Top             =   0
   End
End
Attribute VB_Name = "DateTimeForm"
Attribute VB_GlobalNameSpace = False
Attribute VB_Creatable = False
Attribute VB_PredeclaredId = True
Attribute VB_Exposed = False
Private StartTime As String

Private Init()
StartTime = Date + Time
End Sub






Private Sub Form_Load()
Call Init
StartTime.Caption = StartTime
DateTimeForm.Height = 2205
DateTimeField.Caption = Date + Time
End Sub


Private Sub Timer1_Timer()
DateTimeField.Caption = Date + Time
End Sub
