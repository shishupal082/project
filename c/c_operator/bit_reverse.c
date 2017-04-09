#include <stdio.h>
void decToBin(unsigned int n) {
    int a[10], i, j;
    int count = 0;
    for(i=0;n>0;i++) {
        count++;
        a[i] = n%2;
        n=n/2;
    }
    printf("\n");
    for(j=count;j<8;j++) {
        printf("0");
    }
    for(i=i-1;i>=0;i--) {
        printf("%d",a[i]);
    }
}
 
int main()
{
    int x = 32, y;
    printf("Enter unsigned integer : ");
    scanf("%u",&x);
    if (x < 0) {
        printf("Invalid input\n");
        return 0;
    }
    decToBin(x);
    y = x^255;
    decToBin(y);
    printf("\nPrevalue = %u, and after bit reversal = %u \n", x, y);
    return 0;
}