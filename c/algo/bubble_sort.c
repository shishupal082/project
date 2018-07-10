//C program to short integers using bubble sort

/*
Bubble Sort is the simplest sorting algorithm that works by repeatedly swapping the adjacent elements if they are in wrong order.
*/

#include<stdio.h>
#include "../partial/partial.h"

int main(int argc, char *argv[]) {
    printf("------------------------------\n");
    int arr[] = {12,11,13,5,6,7,4,1,8};
    // int arr[] = {12,11,13,5};
    int arr_size = sizeof(arr)/sizeof(arr[0]);
    printf("Given array is :\n");
    printArray(arr, 0, arr_size-1);
    printf("------------------------------\n");
    int i, j;
    for (i=0; i<arr_size; i++) {
        for (j=0; j<arr_size-1-i; j++) {
            /*Here we have compare with next element*/
            if (arr[j] > arr[j+1]) {
                swapInt(&arr[j], &arr[j+1]);
            }
        }
        printf("After %d iteration : ", i+1);printArray(arr, 0, arr_size-1);
    }
    printArray(arr, 0, arr_size-1);
    printf("------------------------------\n");
    return 0;
}

/*

------------------------------
Given array is :
12 11 13 5 6 7 4 1 8
------------------------------
After 1 iteration : 11 12 5 6 7 4 1 8 13
After 2 iteration : 11 5 6 7 4 1 8 12 13
After 3 iteration : 5 6 7 4 1 8 11 12 13
After 4 iteration : 5 6 4 1 7 8 11 12 13
After 5 iteration : 5 4 1 6 7 8 11 12 13
After 6 iteration : 4 1 5 6 7 8 11 12 13
After 7 iteration : 1 4 5 6 7 8 11 12 13
After 8 iteration : 1 4 5 6 7 8 11 12 13
After 9 iteration : 1 4 5 6 7 8 11 12 13
1 4 5 6 7 8 11 12 13
------------------------------

*/