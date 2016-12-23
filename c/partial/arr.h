void print(int a[], int start_index, int last_endex){
    int i;
    for (i=start_index; i<=last_endex; i++) {
        if(i<last_endex){
            printf("%d ", a[i]);
        } else {
            printf("%d", a[i]);
        }
    }
    printf("\n");
}