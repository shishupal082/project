#include <stdio.h>
#include "../partial/arr.h"
extern void print();
int main(){
    static int arr[] = {1,2,3,4,5,6,7,8}; //Size = 8
    int i;
    printf("i=%d\n", i); //Garbage value
    for (i = 2; i < 6; ++i) {
        printf("i=%d\n", i);
        print(arr, 0, 7);
        arr[arr[i]] = arr[i];
        print(arr, 0, 7);
    }
    printf("\n====End of Programm.====\n");
    return 0;
}

/*
i=2
1 2 3 4 5 6 7 8
1 2 3 3 5 6 7 8
i=3
1 2 3 3 5 6 7 8
1 2 3 3 5 6 7 8
i=4
1 2 3 3 5 6 7 8
1 2 3 3 5 5 7 8
i=5
1 2 3 3 5 5 7 8
1 2 3 3 5 5 7 8
*/