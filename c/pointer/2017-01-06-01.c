#include <stdio.h>
int main(){
	int const*p = 5; //segmentation fault
	printf("%d\n", (*p));
	return 0;
}