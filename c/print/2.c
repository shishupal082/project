#include <stdio.h>

int main(){
    int a = 1;
    int b = 3;
    int c = 4;
    if (a > b){ //Fail
    	if (b > c) {
    		printf("one");
    	} else {
    		printf("two");
    	}
    }
    printf("\n====End of Programm.====\n");
    return 0;
}