Assumption:
(1) No initiation indication
(2) No seprate overlap (overlap is shown with H/S ASR)

Expression is added in .js file only yard.json is used for creation of yard

Point and point zone track circuit indication
----------------------------------------------
normal + reverse + nke x 2 + rke x 2 + cke x 2 = total 8 indication required

Total LED required
Yellow 8 + Red 6 = 14

8AT
8AT(1-4): 8AT-nke (Overlap indication)
8AT(5): point-normal-indication
8AT(6-7): 8AT-cke
8AT(8): point-reverse-indication
8AT(9): 8AT-rke

8BT

8BT(1-2): 8BT-cke
8BT(3): point-normal-indication
8BT(4-7): 8BT-NKE
8BT(8): point-reverse-indication
8BT(9-10): 8BT-RKE

