//C program to short 8 integers using merge sort

#include<stdio.h>
#include "../partial/arr.h"
/*
Merge two sub arrays of arr[]
first subarray is arr[l to m]
second subarray is arr [m+1 to r]
*/
void merge(int a[], int l, int m, int r) {
    printf("merge : l=%d,m=%d,r=%d\n", l, m, r);
    print(a, l, r);
    int i, j, k;
    int n1 = m-l+1;
    int n2 = r-m;
    int L[n1], R[n2];//Create temp arrays
    //Copy data to temp array
    // printf("Length : left arr=%d,right arr=%d\n", n1, n2);
    for (i=0; i<n1; i++) {
        printf("L[%d], %d\n", i, a[l+i]);
        L[i] = a[l+i];
    }
    for (j=0; j<n2; j++) {
        printf("R[%d], %d\n", j, a[m+1+j]);
        R[j] = a[m+1+j];
    }
    printf("Left array (Len=%d): ", n1);print(L, 0, n1-1);
    printf("Right array(Len=%d): ", n2);print(R, 0, n2-1);
    //Merge the temp arrays back into a[l to r]
    i=0;
    j=0;
    k=l;
    while (i<n1 && j<n2) {
        if (L[i] <= R[j]) {
            a[k] = L[i];
            i++;
        } else {
            a[k] = R[j];
            j++;
        }
        k++;
    }
    while (i<n1) {
        a[k] = L[i];
        i++;
        k++;
    }
    while (j<n2) {
        a[k] = R[j];
        j++;
        k++;
    }
    print(a, l, r);
}
void mergeSort(int a[], int l, int r) {
    printf("mergeSort : l=%d,r=%d\n", l, r);
    print(a, l, r);
    if (l<r) {
        int m = (l+r)/2;
        mergeSort(a, l, m);
        mergeSort(a, m+1, r);
        merge(a, l, m, r);
    }
}
int main(int argc, char *argv[]) {
    printf("------------------------------\n");
    int arr[] = {12,11,13,5,6,7,4,1,8};
    // int arr[] = {12,11,13,5};
    int arr_size = sizeof(arr)/sizeof(arr[0]);
    printf("Given array is :\n");
    print(arr, 0, arr_size-1);
    printf("------------------------------\n");
    mergeSort(arr, 0, arr_size-1);
    printf("Shorted array is :\n");
    print(arr, 0, arr_size-1);
    printf("------------------------------\n");
    return 0;
}

/*
Final output
------------------------------
Given array is :
12 11 13 5 6 7 4 1 8
------------------------------
mergeSort : l=0,r=8
12 11 13 5 6 7 4 1 8
mergeSort : l=0,r=4
12 11 13 5 6
mergeSort : l=0,r=2
12 11 13
mergeSort : l=0,r=1
12 11
mergeSort : l=0,r=0
12
mergeSort : l=1,r=1
11
merge : l=0,m=0,r=1
12 11
L[0], 12
R[0], 11
Left array (Len=1): 12
Right array(Len=1): 11
11 12
mergeSort : l=2,r=2
13
merge : l=0,m=1,r=2
11 12 13
L[0], 11
L[1], 12
R[0], 13
Left array (Len=2): 11 12
Right array(Len=1): 13
11 12 13
mergeSort : l=3,r=4
5 6
mergeSort : l=3,r=3
5
mergeSort : l=4,r=4
6
merge : l=3,m=3,r=4
5 6
L[0], 5
R[0], 6
Left array (Len=1): 5
Right array(Len=1): 6
5 6
merge : l=0,m=2,r=4
11 12 13 5 6
L[0], 11
L[1], 12
L[2], 13
R[0], 5
R[1], 6
Left array (Len=3): 11 12 13
Right array(Len=2): 5 6
5 6 11 12 13
mergeSort : l=5,r=8
7 4 1 8
mergeSort : l=5,r=6
7 4
mergeSort : l=5,r=5
7
mergeSort : l=6,r=6
4
merge : l=5,m=5,r=6
7 4
L[0], 7
R[0], 4
Left array (Len=1): 7
Right array(Len=1): 4
4 7
mergeSort : l=7,r=8
1 8
mergeSort : l=7,r=7
1
mergeSort : l=8,r=8
8
merge : l=7,m=7,r=8
1 8
L[0], 1
R[0], 8
Left array (Len=1): 1
Right array(Len=1): 8
1 8
merge : l=5,m=6,r=8
4 7 1 8
L[0], 4
L[1], 7
R[0], 1
R[1], 8
Left array (Len=2): 4 7
Right array(Len=2): 1 8
1 4 7 8
merge : l=0,m=4,r=8
5 6 11 12 13 1 4 7 8
L[0], 5
L[1], 6
L[2], 11
L[3], 12
L[4], 13
R[0], 1
R[1], 4
R[2], 7
R[3], 8
Left array (Len=5): 5 6 11 12 13
Right array(Len=4): 1 4 7 8
1 4 5 6 7 8 11 12 13
Shorted array is :
1 4 5 6 7 8 11 12 13
------------------------------
*/
