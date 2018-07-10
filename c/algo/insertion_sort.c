//C program to short integers using insertion sort

/*
Insertion sort is a simple sorting algorithm that works the way we sort playing cards in our hands.
After peaking another card we put it into correct place
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
    int i, j, key;
    for (i=0; i<arr_size; i++) {
        key = arr[i];
        j = i-1;
        while(j>=0 && arr[j] > key) {
            arr[j+1] = arr[j];
            j--;
        }
        arr[j+1] = key;
        printf("After %d iteration : ", i+1);printArray(arr, 0, arr_size-1);
    }
    printf("------------------------------\n");
    printf("Shorted array is :\n");
    printArray(arr, 0, arr_size-1);
    return 0;
}

/*
------------------------------
Given array is :
12 11 13 5 6 7 4 1 8
------------------------------
After 1 iteration : 12 11 13 5 6 7 4 1 8
After 2 iteration : 11 12 13 5 6 7 4 1 8
After 3 iteration : 11 12 13 5 6 7 4 1 8
After 4 iteration : 5 11 12 13 6 7 4 1 8
After 5 iteration : 5 6 11 12 13 7 4 1 8
After 6 iteration : 5 6 7 11 12 13 4 1 8
After 7 iteration : 4 5 6 7 11 12 13 1 8
After 8 iteration : 1 4 5 6 7 11 12 13 8
After 9 iteration : 1 4 5 6 7 8 11 12 13
------------------------------
Shorted array is :
1 4 5 6 7 8 11 12 13
*/