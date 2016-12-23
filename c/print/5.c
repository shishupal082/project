#include <stdio.h>
int main(){
    int i=0;
    {
    	int j=3;
    	printf("%d\n", i);// i = 0
    	printf("%d\n", j); // j = 3
    }
    printf("%d\n", i); // i = 0
    //printf("%d\n", j); Undeclaried identifier compilation error
    printf("\n====End of Programm.====\n");
    return 0;
}