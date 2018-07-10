//C program to short integers

/*
The selection sort algorithm sorts an array by repeatedly finding the minimum element (considering ascending order) from unsorted part and putting it at the beginning. The algorithm maintains two subarrays in a given array.

1) The subarray which is already sorted.
2) Remaining subarray which is unsorted.

In every iteration of selection sort, 
the minimum element (considering ascending order) from the unsorted subarray is picked 
and moved to the sorted subarray.

Selecting the position and putting correct value into it
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
    int i, j, min_idx;
    for (i=0; i<arr_size; i++) {
        min_idx = i;
        /*Here we can use j=i+1, because first element aready sorted*/
        for (j=i+1; j<arr_size; j++) {
            if (arr[min_idx] > arr[j]) {
                min_idx = j;
            }
        }
        swapInt(&arr[min_idx], &arr[i]);
        printf("After %d iteration : ", i+1);printArray(arr, 0, arr_size-1);
    }
    printArray(arr, 0, arr_size-1);
    printf("------------------------------\n");
    return 0;
}

/*

*/