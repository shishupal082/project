#include <stdio.h>  
int main() {
	int a[10],n,i, given_num;
	printf("Enter the number to convert: ");
	scanf("%d",&given_num);
	if (given_num<0) {
		n = given_num * (-1);
	} else {
		n = given_num;
	}
	for(i=0;n>0;i++) {
		if (given_num < 0) {
			a[i] = n%2 == 1 ? 0 : 1;
		} else {
			a[i] = n%2;
		}
		n=n/2;
	}
	printf("\nBinary of Given Number is=");
	for(i=i-1;i>=0;i--) {
		printf("%d",a[i]);
	}
	printf("\n");
	return 0;
}  