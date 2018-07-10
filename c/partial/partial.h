void swapInt(int *x, int *y){
    int temp = *x;
    *x = *y;
    *y = temp;
}
void printArray(int a[], int start_index, int last_endex){
    int i;
    for (i=start_index; i<=last_endex; i++) {
        /*This is used to avoid space at the end of display*/
        if(i<last_endex){
            printf("%d ", a[i]);
        } else {
            printf("%d", a[i]);
        }
    }
    printf("\n");
}
