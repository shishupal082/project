//C program to generate first n (>=3) Fibbonacci numbers

#include<stdio.h>
#include <stdlib.h>
int main(int argc, char *argv[]) {
	int f0, f1, f2, n, i;
	//Note argv[0] = ./a.out
	if (argc >= 2) {
		// n = argv[1]*1;
		n = atoi(argv[1]);
	} else {
		printf("Enter value of n, (n>=3): ");
		scanf("%d", &n);
	}
	f0=1;
	f1=1;
	printf("Fibbonacci series for n = %d\n", n);
	printf("%d %d ", f0, f1);
	for (int i = 3; i <= n; ++i) {
		f2 = f1+f0;
		printf("%d ", f2);
		f0 = f1;
		f1 = f2;
	}
	printf("\n");
	return 0;
}
